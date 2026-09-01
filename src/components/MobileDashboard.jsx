import React, { useState, useEffect, useRef } from 'react';
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
import {
  BarChart3,
  Calendar,
  Camera,
  Clock,
  CloudRain,
  Droplets,
  ExternalLink,
  MapPin,
  Pause,
  Play,
  RefreshCw,
  SkipBack,
  SkipForward,
  Sun,
  Thermometer,
  Wind
} from 'lucide-react';

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

const resolveSnapshotUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const baseUrl = import.meta.env.BASE_URL || '/';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
  const cleanUrl = url.replace(/^\.\//, '');
  return `${cleanBase}${cleanUrl}`;
};

export default function MobileDashboard({ data, selectedCity, riverData }) {
  // --- CARD 1 STATE (Gráfico Acúmulo) ---
  const [chartTab, setChartTab] = useState('daily'); // 'daily' | 'hourly'

  // --- CARD 2 STATE (Fotos dos Rios) ---
  const [selectedRiverId, setSelectedRiverId] = useState('riodosul');
  const [manifest, setManifest] = useState(null);
  const [manifestLoading, setManifestLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playIntervalRef = useRef(null);

  const RIVERS_CONFIG = [
    { id: 'riodosul', name: 'Rio do Sul', riverName: 'Rio Itajaí-Açu', badge: 'Elevado J. Thomé' },
    { id: 'blumenau', name: 'Blumenau', riverName: 'Rio Itajaí-Açu', badge: 'Clube Náutico' },
    { id: 'brusque', name: 'Brusque', riverName: 'Rio Itajaí-Mirim', badge: 'Ponte Estaiada' }
  ];

  // Carrega o manifesto de fotos/timelapse dos 3 rios
  const loadManifest = async () => {
    try {
      setManifestLoading(true);
      const baseUrl = import.meta.env.BASE_URL || '/';
      const manifestUrl = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}snapshots/manifest.json?v=${Date.now()}`;
      const res = await fetch(manifestUrl);
      if (res.ok) {
        const json = await res.json();
        setManifest(json);
      }
    } catch (err) {
      console.error('Erro ao carregar manifesto de fotos dos rios:', err);
    } finally {
      setManifestLoading(false);
    }
  };

  useEffect(() => {
    loadManifest();
  }, []);

  const currentSnapshots = manifest?.rivers?.[selectedRiverId] || [];

  // Ajusta o índice inicial para a foto mais recente quando altera o rio
  useEffect(() => {
    if (currentSnapshots.length > 0) {
      setCurrentIndex(currentSnapshots.length - 1);
    }
  }, [selectedRiverId, currentSnapshots.length]);

  // Autoplay da foto (timelapse)
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentIndex((prevIdx) => {
          if (prevIdx >= currentSnapshots.length - 1) return 0;
          return prevIdx + 1;
        });
      }, 1000);
    } else {
      clearInterval(playIntervalRef.current);
    }
    return () => clearInterval(playIntervalRef.current);
  }, [isPlaying, currentSnapshots.length]);

  const activeSnapshot = currentSnapshots[currentIndex] || null;
  const currentRiverConfig = RIVERS_CONFIG.find(r => r.id === selectedRiverId) || RIVERS_CONFIG[0];

  // Configuração do Gráfico Diário (Card 1)
  const dailyData = data?.dailyChartData || [];
  const hourlyData = data?.hourlyChartData || [];

  const dailyChartConfig = {
    labels: dailyData.map(d => d.displayDate),
    datasets: [
      {
        label: 'Precipitação (mm)',
        data: dailyData.map(d => d.precipitation),
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return '#38bdf8';

          const item = dailyData[context.dataIndex];
          if (item?.isToday) {
            const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
            gradient.addColorStop(0, '#0284c7');
            gradient.addColorStop(1, '#38bdf8');
            return gradient;
          }
          if (item?.isForecast) {
            const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
            gradient.addColorStop(0, 'rgba(147, 51, 234, 0.4)');
            gradient.addColorStop(1, 'rgba(192, 132, 252, 0.95)');
            return gradient;
          }
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(37, 99, 235, 0.4)');
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0.85)');
          return gradient;
        },
        borderColor: dailyData.map(d => (d.isToday ? '#38bdf8' : d.isForecast ? '#c084fc' : '#3b82f6')),
        borderWidth: dailyData.map(d => (d.isToday ? 2 : 1)),
        borderRadius: 6,
        borderSkipped: false
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
        padding: 10,
        callbacks: {
          title: (items) => `Data: ${items[0].label}`,
          label: (context) => ` Volume: ${context.parsed.y} mm`
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 9, weight: '600' } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: {
          color: '#94a3b8',
          font: { family: 'Plus Jakarta Sans', size: 9, weight: '600' },
          callback: (v) => `${v}mm`
        },
        beginAtZero: true
      }
    }
  };

  return (
    <div className="space-y-5 pb-8">
      
      {/* ========================================================================= */}
      {/* CARD 1: GRÁFICO DE ACÚMULO DE CHUVA (com previsão dos próximos dias) */}
      {/* ========================================================================= */}
      <section className="glass-card p-4 rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 shadow-xl">
        {/* Header do Card 1 */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-100 leading-tight">
                Acúmulo de Chuva
              </h2>
              <p className="text-[10px] text-slate-400 font-medium">
                Histórico recente e previsão dos próximos dias
              </p>
            </div>
          </div>

          {/* Selector Diário / Horário */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setChartTab('daily')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all ${
                chartTab === 'daily'
                  ? 'bg-cyan-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Diário
            </button>
            <button
              onClick={() => setChartTab('hourly')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all ${
                chartTab === 'hourly'
                  ? 'bg-cyan-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              48h
            </button>
          </div>
        </div>

        {/* Resumo em Números Rápidos */}
        {data?.totals && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-slate-950/80 p-2.5 rounded-2xl border border-cyan-500/20 text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Hoje</span>
              <span className="text-lg font-black text-cyan-400 leading-tight">
                {data.totals.todayMm} <span className="text-[10px] text-slate-400">mm</span>
              </span>
            </div>
            <div className="bg-slate-950/80 p-2.5 rounded-2xl border border-blue-500/20 text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">24 Horas</span>
              <span className="text-lg font-black text-blue-400 leading-tight">
                {data.totals.last24hMm} <span className="text-[10px] text-slate-400">mm</span>
              </span>
            </div>
            <div className="bg-slate-950/80 p-2.5 rounded-2xl border border-purple-500/20 text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">7 Dias</span>
              <span className="text-lg font-black text-purple-400 leading-tight">
                {data.totals.last7DaysMm} <span className="text-[10px] text-slate-400">mm</span>
              </span>
            </div>
          </div>
        )}

        {/* Legenda das Barras */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold mb-2 px-1">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-blue-500 inline-block"></span> Passado
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-cyan-400 inline-block"></span> Hoje
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-purple-400 inline-block"></span> Previsão (+7d)
          </span>
        </div>

        {/* Gráfico Canvas Container */}
        <div className="h-56 w-full pt-1">
          {chartTab === 'daily' ? (
            <Bar data={dailyChartConfig} options={dailyChartOptions} />
          ) : (
            <Line
              data={{
                labels: hourlyData.map(h => h.displayTime),
                datasets: [
                  {
                    fill: true,
                    label: 'Precipitação (mm/h)',
                    data: hourlyData.map(h => h.precipitation),
                    borderColor: '#38bdf8',
                    backgroundColor: 'rgba(56, 189, 248, 0.25)',
                    tension: 0.3,
                    borderWidth: 2,
                    pointRadius: 0
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { ticks: { color: '#94a3b8', font: { size: 8 } }, grid: { color: 'rgba(255,255,255,0.03)' } },
                  y: { ticks: { color: '#94a3b8', font: { size: 8 } }, grid: { color: 'rgba(255,255,255,0.03)' }, beginAtZero: true }
                }
              }}
            />
          )}
        </div>
      </section>


      {/* ========================================================================= */}
      {/* CARD 2: FOTOS DOS RIOS (Com botões dos 3 rios no topo) */}
      {/* ========================================================================= */}
      <section className="glass-card p-4 rounded-3xl border border-red-500/30 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 shadow-xl">
        
        {/* Header & Titulo Card 2 */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-100 leading-tight">
                Fotos dos Rios em Tempo Real
              </h2>
              <p className="text-[10px] text-slate-400 font-medium">
                Monitoramento visual hora a hora dos 3 leitos
              </p>
            </div>
          </div>

          <button
            onClick={loadManifest}
            className="p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-white/10"
            title="Atualizar fotos"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${manifestLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* 3 BOTÕES DE SELEÇÃO DOS RIOS NO TOPO */}
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          {RIVERS_CONFIG.map((river) => {
            const isSelected = river.id === selectedRiverId;
            return (
              <button
                key={river.id}
                onClick={() => {
                  setSelectedRiverId(river.id);
                  setIsPlaying(false);
                }}
                className={`py-2 px-1 rounded-xl text-xs font-black transition-all cursor-pointer text-center flex flex-col items-center justify-center ${
                  isSelected
                    ? 'bg-gradient-to-r from-red-500 to-amber-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.4)] scale-[1.02]'
                    : 'bg-slate-950/90 text-slate-300 border border-white/10 hover:bg-slate-900'
                }`}
              >
                <span className="truncate w-full">{river.name}</span>
                <span className="text-[8px] font-medium opacity-80 truncate w-full">{river.badge}</span>
              </button>
            );
          })}
        </div>

        {/* Moldura da Foto do Rio */}
        <div className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-white/10 shadow-inner flex items-center justify-center group">
          {activeSnapshot ? (
            <img
              src={resolveSnapshotUrl(activeSnapshot.url)}
              alt={`Foto do ${currentRiverConfig.name} - ${activeSnapshot.timeLabel}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://via.placeholder.com/600x337/0f172a/ef4444?text=Captura+de+${encodeURIComponent(currentRiverConfig.name)}`;
              }}
            />
          ) : (
            <div className="p-6 text-center text-slate-400">
              <Camera className="w-8 h-8 mx-auto mb-2 animate-pulse text-red-400" />
              <p className="text-xs font-bold">Carregando fotos do {currentRiverConfig.name}...</p>
            </div>
          )}

          {/* Badge Horário */}
          {activeSnapshot && (
            <div className="absolute top-2 left-2 bg-slate-950/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/15 text-[10px] font-black text-slate-100 flex items-center gap-1.5 shadow">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>{activeSnapshot.timeLabel}</span>
            </div>
          )}
        </div>

        {/* Controles do Timelapse da Foto */}
        {currentSnapshots.length > 0 && (
          <div className="mt-3 bg-slate-950/90 p-2.5 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-red-500 to-amber-600 text-white shadow hover:opacity-95 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? 'Pausar' : 'Timelapse ▶'}</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentIndex(Math.max(0, currentIndex - 1));
                  }}
                  disabled={currentIndex === 0}
                  className="p-1.5 rounded-lg bg-slate-900 text-slate-300 border border-white/10 disabled:opacity-30"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-bold text-cyan-300 px-1">
                  {currentIndex + 1}/{currentSnapshots.length}
                </span>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentIndex(Math.min(currentSnapshots.length - 1, currentIndex + 1));
                  }}
                  disabled={currentIndex === currentSnapshots.length - 1}
                  className="p-1.5 rounded-lg bg-slate-900 text-slate-300 border border-white/10 disabled:opacity-30"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Slider de Horário */}
            <input
              type="range"
              min="0"
              max={Math.max(0, currentSnapshots.length - 1)}
              value={currentIndex}
              onChange={(e) => {
                setIsPlaying(false);
                setCurrentIndex(parseInt(e.target.value, 10));
              }}
              className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-red-500 focus:outline-none"
            />
          </div>
        )}
      </section>


      {/* ========================================================================= */}
      {/* CARD 3: PREVISÃO DO TEMPO */}
      {/* ========================================================================= */}
      <section className="glass-card p-4 rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 shadow-xl">
        
        {/* Header Card 3 */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-100 leading-tight">
                Previsão do Tempo
              </h2>
              <p className="text-[10px] text-slate-400 font-medium">
                {selectedCity?.name} • Próximos 7 dias
              </p>
            </div>
          </div>
        </div>

        {/* Clima Atual (Condição Agora) */}
        {data?.current && (
          <div className="bg-slate-950/90 p-3 rounded-2xl border border-white/10 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="text-3xl">
                {getWeatherIconEmoji(0, data.totals?.todayMm || 0)}
              </div>
              <div>
                <div className="text-lg font-black text-slate-100 leading-none">
                  {data.current.temp} °C
                </div>
                <div className="text-[10px] font-bold text-cyan-300 mt-0.5">
                  {data.current.weatherText}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-300">
              <div className="flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-blue-400" />
                <span>{data.current.humidity}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-slate-400" />
                <span>{data.current.windSpeed} km/h</span>
              </div>
            </div>
          </div>
        )}

        {/* Lista dos Próximos 7 Dias */}
        <div className="space-y-1.5">
          {(data?.forecast7Days || []).map((item, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                item.isToday
                  ? 'bg-gradient-to-r from-cyan-950/60 to-slate-950 border-cyan-400/50 shadow'
                  : 'bg-slate-950/60 border-slate-800/80'
              }`}
            >
              {/* Dia da semana */}
              <div className="w-24 shrink-0">
                <span className="font-extrabold text-slate-200 block uppercase text-[11px]">
                  {item.isToday ? 'Hoje' : item.dayOfWeek}
                </span>
                <span className="text-[9px] text-slate-400 font-medium">
                  {item.displayDate}
                </span>
              </div>

              {/* Icone do Tempo */}
              <div className="text-xl px-2">
                {getWeatherIconEmoji(item.weatherCode, item.precipMm)}
              </div>

              {/* Chuva mm */}
              <div className="w-20 text-center">
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Chuva</span>
                <span className={`font-black ${item.precipMm > 0 ? 'text-cyan-400' : 'text-slate-500'}`}>
                  {item.precipMm} mm
                </span>
              </div>

              {/* Probabilidade */}
              <div className="w-16 text-right">
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Prob.</span>
                <span className="font-extrabold text-indigo-300">
                  {item.probPct}%
                </span>
              </div>

              {/* Min / Max Temp */}
              {item.tempMin !== undefined && item.tempMax !== undefined && (
                <div className="w-16 text-right font-bold text-[11px]">
                  <span className="text-cyan-300">{item.tempMin}°</span>
                  <span className="text-slate-500 mx-0.5">/</span>
                  <span className="text-amber-400">{item.tempMax}°</span>
                </div>
              )}
            </div>
          ))}
        </div>

      </section>

    </div>
  );
}

function getWeatherIconEmoji(code, mm) {
  if (mm > 25 || code === 95 || code === 96 || code === 99) return '⛈️';
  if (mm > 5 || code === 61 || code === 63 || code === 65) return '🌧️';
  if (mm > 0 || code === 51 || code === 53 || code === 55 || code === 80) return '🌦️';
  if (code === 1 || code === 2 || code === 3) return '⛅';
  return '☀️';
}
