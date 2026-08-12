import React from 'react';
import { Calendar, CalendarDays, Clock, CloudDrizzle, Droplets } from 'lucide-react';

export default function AccumulatedCards({ totals, current }) {
  const cards = [
    {
      id: 'today',
      title: 'Chuva de Hoje',
      subtitle: '00h até agora',
      value: totals?.todayMm ?? 0,
      unit: 'mm',
      icon: CloudDrizzle,
      maxThreshold: 50, // Reference max for progress bar
      gradient: 'from-cyan-500/20 via-sky-500/10 to-transparent',
      borderColor: 'border-cyan-500/40',
      badgeBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      glowColor: 'shadow-[0_0_30px_rgba(6,182,212,0.15)]',
      valueGradient: 'from-white via-cyan-100 to-cyan-400',
      barColor: 'from-cyan-500 to-sky-400'
    },
    {
      id: 'last24h',
      title: 'Últimas 24 Horas',
      subtitle: 'Acumulado móvel 24h',
      value: totals?.last24hMm ?? 0,
      unit: 'mm',
      icon: Clock,
      maxThreshold: 80,
      gradient: 'from-blue-500/20 via-indigo-500/10 to-transparent',
      borderColor: 'border-blue-500/40',
      badgeBg: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      glowColor: 'shadow-[0_0_30px_rgba(59,130,246,0.15)]',
      valueGradient: 'from-white via-blue-100 to-blue-400',
      barColor: 'from-blue-500 to-indigo-400'
    },
    {
      id: 'last7days',
      title: 'Últimos 7 Dias',
      subtitle: 'Acumulado semanal',
      value: totals?.last7DaysMm ?? 0,
      unit: 'mm',
      icon: CalendarDays,
      maxThreshold: 150,
      gradient: 'from-indigo-500/20 via-purple-500/10 to-transparent',
      borderColor: 'border-indigo-500/40',
      badgeBg: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
      glowColor: 'shadow-[0_0_30px_rgba(99,102,241,0.15)]',
      valueGradient: 'from-white via-indigo-100 to-indigo-400',
      barColor: 'from-indigo-500 to-purple-400'
    },
    {
      id: 'month',
      title: 'Mês Atual',
      subtitle: 'Do dia 01 até hoje',
      value: totals?.monthMm ?? 0,
      unit: 'mm',
      icon: Calendar,
      maxThreshold: 250,
      gradient: 'from-sky-500/20 via-teal-500/10 to-transparent',
      borderColor: 'border-sky-500/40',
      badgeBg: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
      glowColor: 'shadow-[0_0_30px_rgba(14,165,233,0.15)]',
      valueGradient: 'from-white via-sky-100 to-teal-300',
      barColor: 'from-sky-500 to-teal-400'
    },
    {
      id: 'current',
      title: 'Taxa Instantânea',
      subtitle: current?.precipitationPerHour > 0 ? getIntensityLabel(current?.precipitationPerHour) : 'Sem chuva no momento',
      value: current?.precipitationPerHour ?? 0,
      unit: 'mm/h',
      icon: Droplets,
      maxThreshold: 20,
      gradient: current?.precipitationPerHour > 0 ? 'from-amber-500/25 via-orange-500/10 to-transparent' : 'from-slate-800/40 to-transparent',
      borderColor: current?.precipitationPerHour > 0 ? 'border-amber-500/40' : 'border-slate-800',
      badgeBg: current?.precipitationPerHour > 0 ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' : 'bg-slate-800 text-slate-400 border-slate-700',
      glowColor: current?.precipitationPerHour > 0 ? 'shadow-[0_0_30px_rgba(245,158,11,0.2)]' : '',
      valueGradient: current?.precipitationPerHour > 0 ? 'from-white via-amber-100 to-amber-400' : 'from-slate-300 to-slate-500',
      barColor: 'from-amber-500 to-orange-400'
    }
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 my-6">
      {cards.map((card) => {
        const IconComponent = card.icon;
        const progressPercentage = Math.min(100, Math.max(5, (card.value / card.maxThreshold) * 100));

        return (
          <div
            key={card.id}
            className={`glass-card p-5 relative overflow-hidden bg-gradient-to-br ${card.gradient} border ${card.borderColor} ${card.glowColor} group`}
          >
            {/* Ambient Background Glow Pattern */}
            <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-cyan-500/10 blur-2xl group-hover:bg-cyan-500/25 transition-all duration-500"></div>

            {/* Top Row: Subtitle + Badge */}
            <div className="flex items-center justify-between mb-4 relative z-10">
              <span className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${card.badgeBg}`}>
                {card.id.toUpperCase()}
              </span>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-slate-200 group-hover:scale-110 transition-transform">
                <IconComponent className="w-4 h-4 text-cyan-400" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xs font-semibold text-slate-300 tracking-wide uppercase mb-1 relative z-10">
              {card.title}
            </h3>

            {/* Value Display */}
            <div className="flex items-baseline gap-1.5 my-2 relative z-10">
              <span className={`text-4xl font-black tracking-tight bg-gradient-to-r ${card.valueGradient} bg-clip-text text-transparent`}>
                {card.value}
              </span>
              <span className="text-sm font-bold text-slate-400">
                {card.unit}
              </span>
            </div>

            {/* Subtitle description */}
            <p className="text-xs text-slate-400 font-medium truncate mb-3 relative z-10">
              {card.subtitle}
            </p>

            {/* Visual Rain Fill Gauge Bar */}
            <div className="w-full h-1.5 bg-slate-950/80 rounded-full overflow-hidden border border-white/5 relative z-10">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${card.barColor} transition-all duration-700`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

function getIntensityLabel(mmPerHour) {
  if (mmPerHour < 2.5) return '🌧️ Garoa Leve';
  if (mmPerHour < 10) return '🌧️ Chuva Moderada';
  if (mmPerHour < 50) return '⛈️ Chuva Forte';
  return '🚨 Chuva Torrencial';
}
