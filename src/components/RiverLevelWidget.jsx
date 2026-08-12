import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Waves, TrendingUp, TrendingDown, Minus, Info, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function RiverLevelWidget({ riverData, loading, error, cityName }) {
  if (loading) {
    return (
      <section className="glass-card-static p-6 my-6 border border-cyan-500/20 bg-slate-900/60 relative overflow-hidden animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
            <Waves className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <div className="h-5 w-48 bg-slate-800 rounded mb-2"></div>
            <div className="h-3 w-64 bg-slate-800/60 rounded"></div>
          </div>
        </div>
        <div className="h-44 bg-slate-950/60 rounded-xl"></div>
      </section>
    );
  }

  if (error || !riverData) {
    return (
      <section className="glass-card-static p-5 my-6 border border-slate-800 bg-slate-900/40 text-center">
        <Waves className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
        <p className="text-xs text-slate-400 font-medium">
          {error || 'Dados de vazão fluvial indisponíveis no momento.'}
        </p>
      </section>
    );
  }

  const { riverMeta, currentDischarge, meanDischarge, ratioToMean, trend, trendText, risk, chartData } = riverData;

  // Visual trend icon selector
  const renderTrendBadge = () => {
    if (trend === 'rising') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
          <TrendingUp className="w-3.5 h-3.5" />
          {trendText}
        </span>
      );
    }
    if (trend === 'falling') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
          <TrendingDown className="w-3.5 h-3.5" />
          {trendText}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
        <Minus className="w-3.5 h-3.5" />
        {trendText}
      </span>
    );
  };

  // Chart Configuration
  const labels = chartData.map(d => d.displayDate);
  const dischargeValues = chartData.map(d => d.discharge);
  const meanValues = chartData.map(d => d.mean);

  const chartConfig = {
    labels,
    datasets: [
      {
        label: 'Vazão do Rio (m³/s)',
        data: dischargeValues,
        fill: true,
        borderColor: '#06b6d4',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 240);
          gradient.addColorStop(0, 'rgba(6, 182, 212, 0.45)');
          gradient.addColorStop(1, 'rgba(6, 182, 212, 0.0)');
          return gradient;
        },
        borderWidth: 2.5,
        pointRadius: chartData.map(d => (d.isToday ? 6 : 2)),
        pointHoverRadius: 7,
        pointBackgroundColor: chartData.map(d => (d.isToday ? '#38bdf8' : '#0891b2')),
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1.5,
        tension: 0.35
      },
      {
        label: 'Média de Referência (m³/s)',
        data: meanValues,
        fill: false,
        borderColor: 'rgba(148, 163, 184, 0.5)',
        borderDash: [5, 5],
        borderWidth: 1.5,
        pointRadius: 0,
        tension: 0.2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#cbd5e1',
          font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' },
          usePointStyle: true,
          boxWidth: 8
        }
      },
      tooltip: {
        backgroundColor: 'rgba(7, 11, 20, 0.95)',
        titleColor: '#f8fafc',
        bodyColor: '#38bdf8',
        borderColor: 'rgba(6, 182, 212, 0.3)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => {
            return ` ${context.dataset.label}: ${context.parsed.y} m³/s`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 10 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: {
          color: '#94a3b8',
          font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' },
          callback: (value) => `${value} m³/s`
        },
        beginAtZero: true
      }
    }
  };

  return (
    <section className="glass-card p-6 my-6 relative overflow-hidden bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/90 border border-cyan-500/20 shadow-[0_15px_40px_rgba(0,0,0,0.4)]">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800 relative z-10">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)] shrink-0">
            <Waves className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-black text-slate-100 tracking-tight">
                {riverMeta.riverName}
              </h3>
              <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {riverMeta.basinName}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
              <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              {riverMeta.description}
            </p>
          </div>
        </div>

        {/* Trend & Risk Badges */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {renderTrendBadge()}

          {/* Risk Level Badge */}
          <div className={`px-3 py-1 rounded-full text-xs font-black border backdrop-blur-md shadow-md ${risk.colorClass}`}>
            {risk.badge}
          </div>
        </div>
      </div>

      {/* Main Flow Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6 relative z-10">
        
        {/* Stat 1: Vazao Atual */}
        <div className="bg-slate-950/70 p-4 rounded-2xl border border-white/10 flex items-center justify-between shadow-inner">
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block mb-0.5">
              Vazão Atual Estimada
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-100 tracking-tight">{currentDischarge}</span>
              <span className="text-xs font-bold text-cyan-400">m³/s</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* Stat 2: Média Histórica */}
        <div className="bg-slate-950/70 p-4 rounded-2xl border border-white/10 flex items-center justify-between shadow-inner">
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block mb-0.5">
              Média da Bacia
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-300 tracking-tight">{meanDischarge}</span>
              <span className="text-xs font-bold text-slate-500">m³/s</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-800/60 text-slate-400 border border-slate-700/50">
            <Waves className="w-5 h-5" />
          </div>
        </div>

        {/* Stat 3: Comparativo % Média */}
        <div className="bg-slate-950/70 p-4 rounded-2xl border border-white/10 flex items-center justify-between shadow-inner">
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block mb-0.5">
              Volume vs. Média
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl font-black ${ratioToMean > 150 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {ratioToMean}%
              </span>
              <span className="text-[11px] font-semibold text-slate-400">do normal</span>
            </div>
          </div>
          <div className={`p-2.5 rounded-xl border ${ratioToMean > 150 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Stat 4: Ameaça Principal */}
        <div className="bg-slate-950/70 p-4 rounded-2xl border border-white/10 flex items-center justify-between shadow-inner">
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block mb-0.5">
              Atenção Local
            </span>
            <span className="text-xs font-bold text-slate-200 line-clamp-2 leading-tight">
              {riverMeta.mainThreat}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Risk Alert Text Box */}
      <div className={`p-3.5 rounded-2xl border mb-6 text-xs font-medium flex items-start gap-2.5 ${risk.colorClass}`}>
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block text-slate-100">{risk.title}</span>
          <p className="opacity-90 mt-0.5">{risk.description}</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Waves className="w-3.5 h-3.5 text-cyan-400" />
            Evolução e Previsão de Descarga Fluvial ($\text{m}^3/\text{s}$)
          </h4>
          <span className="text-[11px] text-slate-400 font-medium">
            Histórico (14 dias) + Previsão (7 dias)
          </span>
        </div>
        <div className="h-64 w-full pt-2">
          <Line data={chartConfig} options={chartOptions} />
        </div>
      </div>
    </section>
  );
}
