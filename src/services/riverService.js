import { getRiverMetadata } from '../data/scRivers';

/**
 * Serviço de Integracao com a Open-Meteo Flood API
 * Busca previsão e histórico de descarga fluvial (m³/s) para a localização informada.
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
  const maxForecastDischarge = Math.max(...discharge.slice(todayIdx));

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

  // Nível de Risco Hidrológico
  const risk = calculateRiverRisk(currentDischarge, meanDischarge, maxForecastDischarge, ratioToMean);

  // Formatação para gráficos
  const chartData = times.map((timeStr, idx) => ({
    date: timeStr,
    displayDate: formatDateLabel(timeStr),
    discharge: round(discharge[idx] || 0),
    mean: round(dischargeMean[idx] || 0),
    max: round(dischargeMax[idx] || 0),
    min: round(dischargeMin[idx] || 0),
    isToday: timeStr === todayStr,
    isForecast: timeStr > todayStr
  }));

  return {
    riverMeta,
    currentDischarge,
    meanDischarge,
    ratioToMean,
    trend,
    trendText,
    risk,
    chartData,
    lastUpdated: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  };
}

function calculateRiverRisk(current, mean, maxForecast, ratio) {
  // Se a vazão prevista ou atual ultrapassar dramaticamente a média (ex: > 3x a 4x a média)
  if (ratio >= 350 || maxForecast >= mean * 4) {
    return {
      level: 'emergency',
      title: 'Emergência (Risco de Transbordamento)',
      description: 'Vazão extrema projetada para a calha do rio. Alto risco de alagamentos ribeirinhos e enxurradas.',
      badge: '🔴 EMERGÊNCIA',
      colorClass: 'border-red-500/50 bg-red-950/30 text-red-300'
    };
  } else if (ratio >= 220 || maxForecast >= mean * 2.5) {
    return {
      level: 'alert',
      title: 'Alerta Hidrológico',
      description: 'Vazão significativamente acima da média. Atenção para áreas baixas próximas ao leito do rio.',
      badge: '🟠 ALERTA',
      colorClass: 'border-amber-500/50 bg-amber-950/30 text-amber-300'
    };
  } else if (ratio >= 140 || maxForecast >= mean * 1.5) {
    return {
      level: 'attention',
      title: 'Atenção Hidrológica',
      description: 'Elevação moderada do fluxo fluviométrico devido ao acumulado de chuvas recente.',
      badge: '🟡 ATENÇÃO',
      colorClass: 'border-yellow-500/50 bg-yellow-950/30 text-yellow-300'
    };
  } else {
    return {
      level: 'normal',
      title: 'Nível Dentro da Normalidade',
      description: 'Vazão do rio operando dentro das médias históricas esperadas para a época.',
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
