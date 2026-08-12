import { getRiverMetadata } from '../data/scRivers';

/**
 * Serviço de Integração com a Open-Meteo Flood API
 * Busca previsão e histórico de descarga fluvial (m³/s) e estima a cota/altura do rio em metros (m).
 */
export async function fetchRiverData(lat, lon, cityId, cityName) {
  const url = `https://flood-api.open-meteo.com/v1/flood?latitude=${lat}&longitude=${lon}&daily=river_discharge,river_discharge_mean,river_discharge_max,river_discharge_min&past_days=14&forecast_days=7`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erro ao conectar com a API Open-Meteo Flood (Status: ${response.status})`);
  }

  const rawData = await response.json();
  const riverMeta = getRiverMetadata(cityId, cityName);

  return processRiverData(rawData, riverMeta);
}

function processRiverData(rawData, riverMeta) {
  const now = new Date();
  const todayStr = now.toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' }); // "YYYY-MM-DD"

  const daily = rawData.daily || {};
  const times = daily.time || [];
  const discharge = daily.river_discharge || [];
  const dischargeMean = daily.river_discharge_mean || [];
  const dischargeMax = daily.river_discharge_max || [];
  const dischargeMin = daily.river_discharge_min || [];

  // Encontra o índice de hoje no array
  let todayIdx = times.findIndex(t => t === todayStr);
  if (todayIdx === -1) {
    todayIdx = Math.max(0, times.length - 8); // fallback
  }

  const currentDischarge = round(discharge[todayIdx] ?? discharge[discharge.length - 1] ?? 0);
  const meanDischarge = round(dischargeMean[todayIdx] ?? riverMeta.normalDischargeMean ?? 10);
  
  const validDischarges = discharge.filter(v => typeof v === 'number' && !isNaN(v));
  const maxForecastDischarge = validDischarges.length > 0 ? Math.max(...validDischarges.slice(todayIdx)) : currentDischarge;

  // Cálculo da altura estimada do nível do rio em metros (m)
  const currentHeightMeters = estimateHeight(currentDischarge, meanDischarge, riverMeta.normalGaugeHeight);
  const maxForecastHeightMeters = estimateHeight(maxForecastDischarge, meanDischarge, riverMeta.normalGaugeHeight);

  // Tendência comparando hoje com 2 dias atrás e com amanhã
  const prevDischarge = discharge[Math.max(0, todayIdx - 2)] ?? currentDischarge;
  const nextDischarge = discharge[Math.min(times.length - 1, todayIdx + 1)] ?? currentDischarge;

  let trend = 'stable';
  let trendText = 'Nível Estável ➡️';
  if (currentDischarge > prevDischarge * 1.15 || nextDischarge > currentDischarge * 1.15) {
    trend = 'rising';
    trendText = 'Nível em Elevação 📈';
  } else if (currentDischarge < prevDischarge * 0.85 && nextDischarge <= currentDischarge) {
    trend = 'falling';
    trendText = 'Nível em Recuo 📉';
  }

  // Percentual em relação à média normal
  const ratioToMean = meanDischarge > 0 ? Math.round((currentDischarge / meanDischarge) * 100) : 100;

  // Nível de Risco Hidrológico baseado em vazão e altura em metros vs cotas de atenção/emergência
  const risk = calculateRiverRisk(
    currentDischarge,
    meanDischarge,
    maxForecastDischarge,
    ratioToMean,
    currentHeightMeters,
    riverMeta
  );

  // Formatação para gráficos (inclui tanto a vazão m³/s quanto a altura estimada em metros m)
  const chartData = times.map((timeStr, idx) => {
    const q = round(discharge[idx] || 0);
    const qMean = round(dischargeMean[idx] || 0);
    const hMeters = estimateHeight(q, qMean || meanDischarge, riverMeta.normalGaugeHeight);
    return {
      date: timeStr,
      displayDate: formatDateLabel(timeStr),
      discharge: q,
      mean: qMean,
      heightMeters: hMeters,
      max: round(dischargeMax[idx] || 0),
      min: round(dischargeMin[idx] || 0),
      isToday: timeStr === todayStr,
      isForecast: timeStr > todayStr
    };
  });

  return {
    riverMeta,
    currentDischarge,
    meanDischarge,
    currentHeightMeters,
    maxForecastHeightMeters,
    ratioToMean,
    trend,
    trendText,
    risk,
    chartData,
    lastUpdated: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  };
}

function estimateHeight(discharge, meanDischarge, baseHeight) {
  if (!discharge || discharge <= 0 || !meanDischarge || meanDischarge <= 0) {
    return round(baseHeight || 1.2);
  }
  // Relação hidráulica: H_est = H_base * (Q / Q_mean)^0.45
  const ratio = discharge / meanDischarge;
  const estimated = baseHeight * Math.pow(ratio, 0.45);
  return round(Math.max(0.2, estimated));
}

function calculateRiverRisk(current, mean, maxForecast, ratio, currentHeight, riverMeta) {
  const { attentionGaugeHeight, emergencyGaugeHeight } = riverMeta;

  if (currentHeight >= emergencyGaugeHeight || ratio >= 350 || maxForecast >= mean * 4) {
    return {
      level: 'emergency',
      title: 'Emergência (Cota de Transbordamento Atingida/Próxima)',
      description: `Nível do rio próximo ou acima da Cota de Emergência (${emergencyGaugeHeight}m). Risco iminente de enchentes ribeirinhas.`,
      badge: '🔴 EMERGÊNCIA',
      colorClass: 'border-red-500/50 bg-red-950/30 text-red-300'
    };
  } else if (currentHeight >= attentionGaugeHeight || ratio >= 220 || maxForecast >= mean * 2.5) {
    return {
      level: 'alert',
      title: 'Alerta Hidrológico (Cota de Atenção Superada)',
      description: `Nível do rio superou a Cota de Atenção (${attentionGaugeHeight}m). Atenção para áreas baixas e margens.`,
      badge: '🟠 ALERTA',
      colorClass: 'border-amber-500/50 bg-amber-950/30 text-amber-300'
    };
  } else if (currentHeight >= attentionGaugeHeight * 0.8 || ratio >= 140 || maxForecast >= mean * 1.5) {
    return {
      level: 'attention',
      title: 'Atenção Hidrológica',
      description: `Elevação gradual da calha do rio. Cota atual de ${currentHeight}m aproximando-se da Cota de Atenção (${attentionGaugeHeight}m).`,
      badge: '🟡 ATENÇÃO',
      colorClass: 'border-yellow-500/50 bg-yellow-950/30 text-yellow-300'
    };
  } else {
    return {
      level: 'normal',
      title: 'Nível em Condição Normal',
      description: `Nível da calha do rio (${currentHeight}m) dentro da faixa de normalidade (${riverMeta.normalGaugeHeight}m).`,
      badge: '🟢 NORMAL',
      colorClass: 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300'
    };
  }
}

function formatDateLabel(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}`;
}

function round(val) {
  if (val === undefined || val === null || isNaN(val)) return 0;
  return Math.round(val * 10) / 10;
}
