import React from 'react';
import { Calendar, CloudRain, Sun, CloudLightning, Droplets, Thermometer } from 'lucide-react';

export default function ForecastWidget({ forecast7Days = [] }) {
  if (!forecast7Days || forecast7Days.length === 0) return null;

  return (
    <section className="glass-card p-5 lg:p-6 my-6 border-indigo-500/30">
      {/* Widget Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xl font-bold text-slate-100">
              Previsão de Chuva para os Próximos 7 Dias
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Estimativa de precipitação ($mm$) e probabilidade diária de chuva
          </p>
        </div>
      </div>

      {/* Horizontal Scroll on Mobile / Grid on Desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {forecast7Days.map((item, idx) => {
          const isHeavyRain = item.precipMm >= 25;
          const isModerateRain = item.precipMm >= 5 && item.precipMm < 25;

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border text-center relative overflow-hidden transition-all duration-300 ${
                item.isToday
                  ? 'bg-gradient-to-b from-cyan-950/70 via-slate-900 to-slate-950 border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.25)] scale-[1.02]'
                  : isHeavyRain
                  ? 'bg-gradient-to-b from-amber-950/40 to-slate-950 border-amber-500/40'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              {/* Day Header */}
              <div className="text-xs font-black uppercase tracking-wider text-slate-300 mb-0.5">
                {item.isToday ? 'Hoje' : item.dayOfWeek}
              </div>
              <div className="text-[10px] font-semibold text-slate-400 mb-2">
                {item.displayDate}
              </div>

              {/* Weather Condition Icon / Emoji */}
              <div className="my-2 text-2xl flex justify-center">
                {getWeatherIconEmoji(item.weatherCode, item.precipMm)}
              </div>

              {/* Expected Rain Volume (mm) */}
              <div className="my-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Precipitação</span>
                <span className={`text-base font-black ${item.precipMm > 0 ? 'text-cyan-400' : 'text-slate-500'}`}>
                  {item.precipMm} <span className="text-[10px] text-slate-400">mm</span>
                </span>
              </div>

              {/* Rain Probability % Bar */}
              <div className="my-2 bg-slate-900/90 p-1.5 rounded-xl border border-white/5">
                <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-300 mb-1">
                  <span className="flex items-center gap-0.5 text-cyan-400">
                    <Droplets className="w-3 h-3" />
                    Prob.
                  </span>
                  <span>{item.probPct}%</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
                    style={{ width: `${item.probPct}%` }}
                  ></div>
                </div>
              </div>

              {/* Temperature Min/Max */}
              {item.tempMax !== undefined && item.tempMin !== undefined && (
                <div className="text-[11px] font-bold text-slate-300 pt-1 flex items-center justify-center gap-1 border-t border-white/5">
                  <span className="text-cyan-300">{item.tempMin}°</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-amber-400">{item.tempMax}°</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function getWeatherIconEmoji(code, mm) {
  if (mm > 25 || code === 95 || code === 96 || code === 99) return '⛈️';
  if (mm > 5 || code === 61 || code === 63 || code === 65) return '🌧️';
  if (mm > 0 || code === 51 || code === 53 || code === 55 || code === 80) return '🌦️';
  if (code === 1 || code === 2 || code === 3) return '⛅';
  return '☀️';
}
