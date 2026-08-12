import React from 'react';
import { CloudDrizzle, CalendarDays, Calendar, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function MobileQuickSummary({ totals, risk }) {
  if (!totals) return null;

  return (
    <div className="block sm:hidden glass-card p-4 my-4 border-cyan-500/30 bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-cyan-950/40 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      {/* Top Header Row */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
          <CloudDrizzle className="w-3.5 h-3.5" />
          Resumo Pluviométrico
        </span>
        
        {/* Risk Badge Compact */}
        {risk && (
          <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${getCompactRiskBadge(risk.level)}`}>
            {risk.badge}
          </span>
        )}
      </div>

      {/* 3 Columns Grid for Today, 7 Days, Month */}
      <div className="grid grid-cols-3 gap-2 text-center">
        
        {/* Hoje */}
        <div className="bg-slate-950/80 p-2.5 rounded-xl border border-cyan-500/20 shadow-inner">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase block mb-0.5">
            Hoje
          </span>
          <div className="text-xl font-black text-cyan-400 leading-tight">
            {totals.todayMm} <span className="text-[10px] text-slate-400 font-semibold">mm</span>
          </div>
          <span className="text-[9px] text-slate-400 font-medium block mt-0.5">00h - Agora</span>
        </div>

        {/* 7 Dias */}
        <div className="bg-slate-950/80 p-2.5 rounded-xl border border-indigo-500/20 shadow-inner">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase block mb-0.5">
            7 Dias
          </span>
          <div className="text-xl font-black text-indigo-400 leading-tight">
            {totals.last7DaysMm} <span className="text-[10px] text-slate-400 font-semibold">mm</span>
          </div>
          <span className="text-[9px] text-slate-400 font-medium block mt-0.5">Semana</span>
        </div>

        {/* Mês */}
        <div className="bg-slate-950/80 p-2.5 rounded-xl border border-sky-500/20 shadow-inner">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase block mb-0.5">
            Mês
          </span>
          <div className="text-xl font-black text-sky-400 leading-tight">
            {totals.monthMm} <span className="text-[10px] text-slate-400 font-semibold">mm</span>
          </div>
          <span className="text-[9px] text-slate-400 font-medium block mt-0.5">Acumulado</span>
        </div>

      </div>
    </div>
  );
}

function getCompactRiskBadge(level) {
  switch (level) {
    case 'emergency': return 'bg-red-500/20 text-red-300 border-red-500/40';
    case 'alert': return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
    case 'attention': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    default: return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  }
}
