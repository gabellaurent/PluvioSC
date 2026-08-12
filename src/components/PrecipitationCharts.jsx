import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { BarChart3, Calendar, Clock, Sparkles } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function PrecipitationCharts({ dailyData = [], hourlyData = [] }) {
  const [activeTab, setActiveTab] = useState('daily'); // 'daily' | 'hourly'

  // Daily Chart Configuration
  const dailyLabels = dailyData.map(d => d.displayDate);
  const dailyValues = dailyData.map(d => d.precipitation);

  const dailyChartConfig = {
    labels: dailyLabels,
    datasets: [
      {
        label: 'Precipitação Diária (mm)',
        data: dailyValues,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return 'rgba(56, 189, 248, 0.7)';

          const item = dailyData[context.dataIndex];
          if (item?.isToday) {
            const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
            gradient.addColorStop(0, '#0284c7');
            gradient.addColorStop(1, '#38bdf8');
            return gradient;
          }
          if (item?.isForecast) {
            const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
            gradient.addColorStop(0, 'rgba(147, 51, 234, 0.3)');
            gradient.addColorStop(1, 'rgba(192, 132, 252, 0.8)');
            return gradient;
          }
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(37, 99, 235, 0.3)');
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0.75)');
          return gradient;
        },
        borderColor: dailyData.map(d => {
          if (d.isToday) return '#38bdf8';
          if (d.isForecast) return '#c084fc';
          return '#3b82f6';
        }),
        borderWidth: dailyData.map(d => (d.isToday ? 2 : 1)),
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: '#0ea5e9'
      }
    ]
  };

  const dailyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(7, 11, 20, 0.95)',
        titleColor: '#f8fafc',
        bodyColor: '#38bdf8',
        borderColor: 'rgba(56, 189, 248, 0.3)',
        borderWidth: 1,
        padding: 14,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          title: (items) => `Data: ${items[0].label}`,
          label: (context) => {
            const item = dailyData[context.dataIndex];
            const probText = item?.probability !== undefined ? ` • Prob: ${item.probability}%` : '';
            return ` Volume: ${context.parsed.y} mm${probText}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: {
          color: '#94a3b8',
          font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' },
          callback: (value) => `${value} mm`
        },
        beginAtZero: true
      }
    }
  };

  // Hourly Chart Configuration
  const hourlyLabels = hourlyData.map(h => h.displayTime);
  const hourlyValues = hourlyData.map(h => h.precipitation);

  const hourlyChartConfig = {
    labels: hourlyLabels,
    datasets: [
      {
        fill: true,
        label: 'Precipitação Horária (mm/h)',
        data: hourlyValues,
        borderColor: '#38bdf8',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 280);
          gradient.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
          gradient.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
          return gradient;
        },
        borderWidth: 2.5,
        pointRadius: hourlyData.map(h => (h.precipitation > 0 ? 4 : 0)),
        pointHoverRadius: 6,
        pointBackgroundColor: '#38bdf8',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1.5,
        tension: 0.35
      }
    ]
  };

  const hourlyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(7, 11, 20, 0.95)',
        titleColor: '#f8fafc',
        bodyColor: '#38bdf8',
        borderColor: 'rgba(56, 189, 248, 0.3)',
        borderWidth: 1,
        padding: 14,
        callbacks: {
          label: (context) => ` Volume Horário: ${context.parsed.y} mm/h`
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
          callback: (value) => `${value} mm`
        },
        beginAtZero: true
      }
    }
  };

  return (
    <section className="glass-card p-6 my-6">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xl font-bold text-slate-100">
              Histórico & Previsão Pluviométrica
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Distribuição detalhada de precipitação acumulada diária e horária
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1.5 rounded-2xl border border-white/10 shadow-inner">
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'daily'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Diário (30d + Previsão 7d)
          </button>
          <button
            onClick={() => setActiveTab('hourly')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'hourly'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Horário (48h)
          </button>
        </div>
      </div>

      {/* Legend Bar */}
      <div className="flex flex-wrap items-center gap-5 text-xs text-slate-300 mb-4 px-3 py-2 bg-slate-950/50 rounded-xl border border-white/5">
        {activeTab === 'daily' ? (
          <>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-blue-500/80 inline-block shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
              <span>Histórico Passado</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-cyan-400 inline-block shadow-[0_0_10px_rgba(56,189,248,0.8)]"></span>
              <span className="font-extrabold text-cyan-300">Dia de Hoje ⭐</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-purple-400/80 inline-block shadow-[0_0_8px_rgba(192,132,252,0.5)]"></span>
              <span>Previsão (Próximos 7 Dias)</span>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block shadow-[0_0_8px_rgba(56,189,248,0.6)]"></span>
            <span>Intensidade por Hora (mm/h)</span>
          </div>
        )}
      </div>

      {/* Chart container */}
      <div className="h-80 w-full pt-2">
        {activeTab === 'daily' ? (
          <Bar data={dailyChartConfig} options={dailyChartOptions} />
        ) : (
          <Line data={hourlyChartConfig} options={hourlyChartOptions} />
        )}
      </div>
    </section>
  );
}
