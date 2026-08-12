import React from 'react';
import { AlertOctagon, AlertTriangle, CheckCircle2, Info, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function RiskAlertBanner({ risk, last24hMm }) {
  if (!risk) return null;

  const levels = [
    { id: 'normal', label: 'Normal', range: '< 30 mm', color: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/40' },
    { id: 'attention', label: 'Atenção', range: '30 - 50 mm', color: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/40' },
    { id: 'alert', label: 'Alerta', range: '50 - 80 mm', color: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500/40' },
    { id: 'emergency', label: 'Emergência', range: '> 80 mm', color: 'bg-red-500', text: 'text-red-400', border: 'border-red-500/40' }
  ];

  const config = {
    normal: {
      bg: 'bg-emerald-950/30 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.1)]',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      icon: ShieldCheck,
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    },
    attention: {
      bg: 'bg-amber-950/30 border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.1)]',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      icon: Info,
      iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    },
    alert: {
      bg: 'bg-orange-950/40 border-orange-500/50 shadow-[0_0_35px_rgba(249,115,22,0.15)]',
      badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
      icon: AlertTriangle,
      iconColor: 'text-orange-400 bg-orange-500/10 border-orange-500/30'
    },
    emergency: {
      bg: 'bg-red-950/50 border-red-500/60 shadow-[0_0_40px_rgba(239,68,68,0.2)] animate-pulse-subtle',
      badge: 'bg-red-500/25 text-red-200 border-red-500/50',
      icon: ShieldAlert,
      iconColor: 'text-red-400 bg-red-500/10 border-red-500/30'
    }
  };

  const style = config[risk.level] || config.normal;
  const IconComponent = style.icon;

  return (
    <div className={`glass-card p-6 my-6 border ${style.bg} relative overflow-hidden transition-all duration-300`}>
      {/* Top Banner Content */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
        
        {/* Left Status info */}
        <div className="flex items-start gap-4">
          <div className={`p-3.5 rounded-2xl border ${style.iconColor} shadow-inner shrink-0`}>
            <IconComponent className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
              <span className={`text-xs font-black uppercase tracking-wider px-3 py-0.5 rounded-full border ${style.badge}`}>
                {risk.badge}
              </span>
              <h4 className="text-lg font-bold text-slate-100">
                {risk.title}
              </h4>
            </div>
            <p className="text-xs md:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
              {risk.description}
            </p>
          </div>
        </div>

        {/* Right 24h Rainfall Highlight Box */}
        <div className="w-full lg:w-auto bg-slate-950/80 p-4 rounded-2xl border border-white/10 flex items-center justify-between lg:justify-end gap-6 shrink-0 shadow-inner">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block mb-0.5">
              Acumulado 24h Atual
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">{last24hMm}</span>
              <span className="text-xs font-bold text-cyan-400">mm</span>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800"></div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block mb-0.5">
              Referência Defesa Civil
            </span>
            <span className="text-xs font-bold text-slate-300">SC Monitoring</span>
          </div>
        </div>

      </div>

      {/* Visual Risk Gauge Meter (4 Stages) */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-2">
          <span>Escala de Risco Pluviométrico (24h)</span>
          <span className="text-slate-300 font-bold">Status: {risk.title.split(' ')[0]}</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {levels.map((lvl) => {
            const isActive = risk.level === lvl.id;
            return (
              <div
                key={lvl.id}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isActive
                    ? `${lvl.color} text-slate-950 font-extrabold shadow-[0_0_15px_rgba(255,255,255,0.2)] scale-[1.02] ${lvl.border}`
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 opacity-60'
                }`}
              >
                <div className={`text-xs font-bold ${isActive ? 'text-slate-950' : 'text-slate-200'}`}>
                  {lvl.label}
                </div>
                <div className={`text-[10px] ${isActive ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                  {lvl.range}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
