/**
 * Servico de Integracao com a Open-Meteo Weather API
 * Traz dados de precipitação em tempo real, acumulados diários/horários e estatísticas.
 */

export async function fetchPluviometryData(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,weather_code,wind_speed_10m&hourly=precipitation,rain,showers,weather_code,temperature_2m&daily=precipitation_sum,rain_sum,showers_sum,precipitation_hours,precipitation_probability_max,temperature_2m_max,temperature_2m_min,weather_code&timezone=America%2FSao_Paulo&past_days=30&forecast_days=7`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erro ao conectar com a API Open-Meteo (Status: ${response.status})`);
  }

  const rawData = await response.json();
  return processPluviometry(rawData);
}

function processPluviometry(data) {
  const now = new Date();
  
  // Formato YYYY-MM-DD em São Paulo (SC)
  const todayStr = now.toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' }); // e.g. "2026-08-12"
  const currentMonthStr = todayStr.substring(0, 7); // e.g. "2026-08"

  const daily = data.daily || {};
  const dailyTimes = daily.time || [];
  const dailyPrecip = daily.precipitation_sum || [];
  const dailyProb = daily.precipitation_probability_max || [];

  const hourly = data.hourly || {};
  const hourlyTimes = hourly.time || [];
  const hourlyPrecip = hourly.precipitation || [];

  // Index do dia de hoje no array diário
  const todayIndex = dailyTimes.findIndex(t => t === todayStr);

  // 1. Chuva de Hoje (00h ate a hora atual ou total do dia)
  let todayMm = 0;
  if (todayIndex !== -1 && dailyPrecip[todayIndex] !== undefined) {
    todayMm = dailyPrecip[todayIndex];
  } else {
    // Fallback: soma hourly do dia de hoje
    todayMm = hourlyTimes.reduce((acc, timeStr, idx) => {
      if (timeStr.startsWith(todayStr)) {
        return acc + (hourlyPrecip[idx] || 0);
      }
      return acc;
    }, 0);
  }

  // 2. Acumulado nas ultimas 24 Horas
  // Encontra o indice da hora atual ou mais proxima
  const currentISOStr = now.toISOString().substring(0, 13); // "2026-08-12T12"
  let currentHourIdx = hourlyTimes.findIndex(t => t.startsWith(currentISOStr));
  if (currentHourIdx === -1) {
    currentHourIdx = hourlyTimes.length - 1;
  }
  
  const start24hIdx = Math.max(0, currentHourIdx - 24);
  const last24hMm = hourlyPrecip
    .slice(start24hIdx, currentHourIdx + 1)
    .reduce((sum, val) => sum + (val || 0), 0);

  // 3. Acumulado dos ultimos 7 dias (incluindo hoje)
  let last7DaysMm = 0;
  if (todayIndex !== -1) {
    const start7Idx = Math.max(0, todayIndex - 6);
    last7DaysMm = dailyPrecip
      .slice(start7Idx, todayIndex + 1)
      .reduce((sum, val) => sum + (val || 0), 0);
  }

  // 4. Acumulado do Mês Atual (do dia 1 ao dia atual)
  let monthMm = 0;
  dailyTimes.forEach((timeStr, idx) => {
    if (timeStr.startsWith(currentMonthStr) && timeStr <= todayStr) {
      monthMm += dailyPrecip[idx] || 0;
    }
  });

  // 5. Acumulado dos ultimos 30 dias
  const last30DaysMm = dailyPrecip
    .slice(0, Math.min(31, dailyPrecip.length))
    .reduce((sum, val) => sum + (val || 0), 0);

  // 6. Chuva Atual (mm/h)
  const currentMmPerHour = data.current?.precipitation || 0;

  // 7. Risco Pluviometrico (Defesa Civil SC base 24h)
  const riskLevel = getRiskLevel(last24hMm);

  // 8. Formata dados para os gráficos
  const dailyChartData = dailyTimes.map((time, idx) => ({
    date: time,
    displayDate: formatDateLabel(time),
    precipitation: round(dailyPrecip[idx] || 0),
    probability: dailyProb[idx] || 0,
    isToday: time === todayStr,
    isForecast: time > todayStr
  }));

  // Grafico das ultimas 48 horas + 24h futuras
  const hourlyRangeStart = Math.max(0, currentHourIdx - 36);
  const hourlyRangeEnd = Math.min(hourlyTimes.length, currentHourIdx + 24);
  const hourlyChartData = hourlyTimes.slice(hourlyRangeStart, hourlyRangeEnd).map((time, idx) => {
    const actualIdx = hourlyRangeStart + idx;
    return {
      time: time,
      displayTime: formatTimeLabel(time),
      precipitation: round(hourlyPrecip[actualIdx] || 0),
      temperature: round(hourly.temperature_2m?.[actualIdx] || 0),
      isPast: actualIdx <= currentHourIdx
    };
  });

  // 9. Previsao dedicada dos proximos 7 dias
  const forecast7Days = dailyTimes
    .filter(t => t >= todayStr)
    .slice(0, 7)
    .map(timeStr => {
      const idx = dailyTimes.indexOf(timeStr);
      return {
        date: timeStr,
        displayDate: formatDateLabel(timeStr),
        dayOfWeek: getDayOfWeekName(timeStr),
        isToday: timeStr === todayStr,
        precipMm: round(dailyPrecip[idx] || 0),
        probPct: dailyProb[idx] || 0,
        tempMax: round(daily.temperature_2m_max?.[idx]),
        tempMin: round(daily.temperature_2m_min?.[idx]),
        weatherCode: daily.weather_code?.[idx],
        weatherText: getWeatherDescription(daily.weather_code?.[idx])
      };
    });

  return {
    raw: data,
    current: {
      temp: round(data.current?.temperature_2m),
      humidity: data.current?.relative_humidity_2m,
      windSpeed: round(data.current?.wind_speed_10m),
      precipitationPerHour: round(currentMmPerHour),
      weatherCode: data.current?.weather_code,
      weatherText: getWeatherDescription(data.current?.weather_code)
    },
    totals: {
      todayMm: round(todayMm),
      last24hMm: round(last24hMm),
      last7DaysMm: round(last7DaysMm),
      monthMm: round(monthMm),
      last30DaysMm: round(last30DaysMm)
    },
    risk: riskLevel,
    dailyChartData,
    hourlyChartData,
    forecast7Days,
    lastUpdated: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  };
}

function getRiskLevel(mm24h) {
  if (mm24h >= 80) {
    return {
      level: 'emergency',
      title: 'Emergência (Risco Muito Alto)',
      description: 'Volume extremo de chuva nas últimas 24h. Risco iminente de alagamentos sérios e enxurradas.',
      colorClass: 'risk-emergency',
      badge: '🔴 EMERGÊNCIA'
    };
  } else if (mm24h >= 50) {
    return {
      level: 'alert',
      title: 'Alerta (Risco Alto)',
      description: 'Acumulado elevado em 24h. Atenção para nível de rios e encostas.',
      colorClass: 'risk-alert',
      badge: '🟠 ALERTA'
    };
  } else if (mm24h >= 30) {
    return {
      level: 'attention',
      title: 'Atenção (Risco Moderado)',
      description: 'Volume moderado acumulado. Recomendado monitorar previsões locais.',
      colorClass: 'risk-attention',
      badge: '🟡 ATENÇÃO'
    };
  } else {
    return {
      level: 'normal',
      title: 'Condição Normal (Sem Risco Ativo)',
      description: 'Volume de chuva dentro da normalidade para o período de 24h.',
      colorClass: 'risk-normal',
      badge: '🟢 NORMAL'
    };
  }
}

function getWeatherDescription(code) {
  const codes = {
    0: 'Céu limpo',
    1: 'Predominantemente limpo',
    2: 'Parcialmente nublado',
    3: 'Encoberto',
    45: 'Nevoeiro',
    48: 'Nevoeiro com geada',
    51: 'Garoa leve',
    53: 'Garoa moderada',
    55: 'Garoa densa',
    61: 'Chuva leve',
    63: 'Chuva moderada',
    65: 'Chuva forte',
    80: 'Pancadas de chuva leves',
    81: 'Pancadas de chuva moderadas',
    82: 'Pancadas de chuva violentas',
    95: 'Tempestade com trovoadas',
    96: 'Tempestade com granizo leve',
    99: 'Tempestade com granizo forte'
  };
  return codes[code] || 'Tempo variável';
}

function formatDateLabel(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}`;
}

function formatTimeLabel(isoStr) {
  if (!isoStr) return '';
  const timePart = isoStr.split('T')[1];
  if (!timePart) return isoStr;
  return `${timePart.substring(0, 5)}h`;
}

function getDayOfWeekName(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length < 3) return '';
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return days[date.getDay()];
}

function round(val) {
  if (val === undefined || val === null || isNaN(val)) return 0;
  return Math.round(val * 10) / 10;
}
