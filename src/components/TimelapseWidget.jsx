import React, { useState, useEffect, useRef } from 'react';
import { Camera, Clock, Play, Pause, SkipBack, SkipForward, RefreshCw, Layers, MapPin, Sparkles, AlertCircle } from 'lucide-react';

export default function TimelapseWidget({ selectedCity }) {
  const [manifest, setManifest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRiverId, setSelectedRiverId] = useState('riodosul');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playIntervalRef = useRef(null);

  const RIVERS_CONFIG = [
    { id: 'riodosul', name: 'Rio do Sul', riverName: 'Rio Itajaí-Açu / Itajaí do Sul', badge: 'Elevado José Thomé' },
    { id: 'blumenau', name: 'Blumenau', riverName: 'Rio Itajaí-Açu (Remo / Beira-Rio)', badge: 'Clube Náutico América' },
    { id: 'brusque', name: 'Brusque', riverName: 'Rio Itajaí-Mirim', badge: 'Ponte Estaiada' }
  ];

  // Sincroniza com a cidade selecionada no topo da página
  useEffect(() => {
    if (selectedCity?.id) {
      const match = RIVERS_CONFIG.find(r => r.id === selectedCity.id || selectedCity.id.includes(r.id));
      if (match) {
        setSelectedRiverId(match.id);
      }
    }
  }, [selectedCity]);

  // Carrega o manifest.json das capturas horárias
  const loadManifest = async () => {
    try {
      setLoading(true);
      const res = await fetch('./snapshots/manifest.json?v=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        setManifest(data);
      } else {
        console.warn('Manifesto de snapshots ainda não encontrado, usando fallback local.');
      }
    } catch (err) {
      console.error('Erro ao carregar manifesto de timelapse:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadManifest();
  }, []);

  // Lista de snapshots do rio selecionado
  const currentSnapshots = manifest?.rivers?.[selectedRiverId] || [];

  // Ajusta o índice inicial para o mais recente quando muda de rio
  useEffect(() => {
    if (currentSnapshots.length > 0) {
      setCurrentIndex(currentSnapshots.length - 1);
    }
  }, [selectedRiverId, currentSnapshots.length]);

  // Autoplay da animação do Timelapse (1 segundo por foto)
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentIndex((prevIdx) => {
          if (prevIdx >= currentSnapshots.length - 1) {
            return 0; // Looping no início
          }
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

  return (
    <section className="glass-card p-6 my-6 relative overflow-hidden bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/90 border border-cyan-500/20 shadow-[0_15px_40px_rgba(0,0,0,0.4)]">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/3 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800 relative z-10">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)] shrink-0">
            <Clock className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-black text-slate-100 tracking-tight">
                Timelapse 24h & Linha do Tempo dos Rios
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Captura a cada 1h
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Compare visualmente a evolução da altura da água hora a hora nas últimas 24 horas
            </p>
          </div>
        </div>

        {/* Reload Button */}
        <button
          onClick={loadManifest}
          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-950/80 text-slate-300 border border-white/10 hover:border-cyan-500/40 hover:bg-slate-900 transition-all cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 inline mr-1 ${loading ? 'animate-spin' : ''}`} />
          Atualizar Linha do Tempo
        </button>
      </div>

      {/* Main Container */}
      <div className="mt-6 relative z-10 space-y-5">
        
        {/* River Pills Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {RIVERS_CONFIG.map((river) => {
            const isSelected = river.id === selectedRiverId;
            return (
              <button
                key={river.id}
                onClick={() => {
                  setSelectedRiverId(river.id);
                  setIsPlaying(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.35)] scale-105'
                    : 'bg-slate-950/80 text-slate-300 border border-white/10 hover:border-cyan-500/40 hover:bg-slate-900'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>{river.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900/80 text-cyan-300 font-mono">
                  {river.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Snapshot Display Frame */}
        <div className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center group">
          {activeSnapshot ? (
            <img
              src={activeSnapshot.url}
              alt={`Snapshot ${currentRiverConfig.name} - ${activeSnapshot.timeLabel}`}
              className="w-full h-full object-cover transition-opacity duration-300"
              onError={(e) => {
                // Se a imagem não for encontrada, mostra o fallback gerado
                e.target.onerror = null;
                e.target.src = `https://via.placeholder.com/800x450/0f172a/38bdf8?text=Captura+de+${encodeURIComponent(currentRiverConfig.name)}+(${encodeURIComponent(activeSnapshot.timeLabel)})`;
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Camera className="w-10 h-10 text-slate-500 mb-3 animate-pulse" />
              <p className="text-sm font-bold text-slate-300">Carregando histórico do Timelapse...</p>
              <p className="text-xs text-slate-500 mt-1">Primeiras capturas automáticas sendo catalogadas.</p>
            </div>
          )}

          {/* Timestamp Overlay Badge */}
          {activeSnapshot && (
            <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15 text-xs font-black text-slate-100 shadow-lg flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{activeSnapshot.timeLabel}</span>
              <span className="text-[10px] uppercase text-cyan-300 font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/30">
                {currentIndex + 1} de {currentSnapshots.length}
              </span>
            </div>
          )}
        </div>

        {/* Timeline Control Bar (Play, Range Slider, Step) */}
        {currentSnapshots.length > 0 && (
          <div className="bg-slate-950/90 p-4 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between gap-4">
              
              {/* Playback buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:opacity-95 transition-all cursor-pointer"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      Reproduzir Timelapse ▶️
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentIndex(Math.max(0, currentIndex - 1));
                  }}
                  disabled={currentIndex === 0}
                  className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white disabled:opacity-40 transition-all cursor-pointer"
                  title="Hora anterior"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentIndex(Math.min(currentSnapshots.length - 1, currentIndex + 1));
                  }}
                  disabled={currentIndex === currentSnapshots.length - 1}
                  className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white disabled:opacity-40 transition-all cursor-pointer"
                  title="Próxima hora"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Active Timestamp Info */}
              <div className="text-right">
                <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Horário da Foto</span>
                <span className="text-xs font-black text-cyan-300">{activeSnapshot?.timeLabel || '-'}</span>
              </div>
            </div>

            {/* Range Slider 24h */}
            <div className="pt-2">
              <input
                type="range"
                min="0"
                max={Math.max(0, currentSnapshots.length - 1)}
                value={currentIndex}
                onChange={(e) => {
                  setIsPlaying(false);
                  setCurrentIndex(parseInt(e.target.value, 10));
                }}
                className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
              />

              {/* Slider Min/Max Labels */}
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1">
                <span>Há 24 horas ({currentSnapshots[0]?.timeLabel || '00:00'})</span>
                <span className="text-cyan-400">Arraste para navegar no tempo ⏱️</span>
                <span>Última Foto ({currentSnapshots[currentSnapshots.length - 1]?.timeLabel || 'Agora'})</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
