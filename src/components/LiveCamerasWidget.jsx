import React, { useState } from 'react';
import { Camera, ExternalLink, ShieldAlert, Video, Waves, Radio, Eye, Layers } from 'lucide-react';

export default function LiveCamerasWidget() {
  const [activeTab, setActiveTab] = useState('stream'); // 'stream' | 'portals'

  const DEFESA_CIVIL_PORTALS = [
    {
      id: 'sc-barragens',
      title: 'Defesa Civil SC (Barragens)',
      region: 'Estado de Santa Catarina',
      description: 'Monitoramento em tempo real das barragens de Taió (Oeste), Ituporanga (Sul) e José Boiteux.',
      url: 'https://monitoramento.defesacivil.sc.gov.br/',
      badge: 'Barragens de SC',
      color: 'from-amber-500/20 to-red-500/20 border-amber-500/30 text-amber-300'
    },
    {
      id: 'taio',
      title: 'Defesa Civil de Taió',
      region: 'Alto Vale do Itajaí',
      description: 'Informações de montante/jusante da Barragem Oeste e nível do Rio Itajaí do Oeste.',
      url: 'https://defesacivil.taio.sc.gov.br/',
      badge: 'Taió SC',
      color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-300'
    },
    {
      id: 'riodosul',
      title: 'Defesa Civil de Rio do Sul',
      region: 'Alto Vale do Itajaí',
      description: 'Cotas do rio nas pontes urbanas, radar pluviométrico e réguas telemétricas.',
      url: 'https://defesacivil.riodosul.sc.gov.br/',
      badge: 'Rio do Sul SC',
      color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-300'
    },
    {
      id: 'alertablu',
      title: 'AlertaBlu (Blumenau)',
      region: 'Médio Vale do Itajaí',
      description: 'Portal oficial da Defesa Civil de Blumenau para nível do Rio Itajaí-Açu e avisos.',
      url: 'https://alertablu.blumenau.sc.gov.br/',
      badge: 'Blumenau SC',
      color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-300'
    }
  ];

  return (
    <section className="glass-card p-6 my-6 relative overflow-hidden bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/90 border border-cyan-500/20 shadow-[0_15px_40px_rgba(0,0,0,0.4)]">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800 relative z-10">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-red-500/20 to-amber-500/20 text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)] shrink-0">
            <Camera className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-black text-slate-100 tracking-tight">
                Câmeras & Portais ao Vivo da Defesa Civil
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.3)] animate-pulse">
                <Radio className="w-3 h-3" />
                🔴 AO VIVO
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Acompanhamento visual em tempo real do Rio Itajaí-Açu e acesso direto aos portais das barragens de SC
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1.5 rounded-2xl border border-white/10 shadow-inner shrink-0">
          <button
            onClick={() => setActiveTab('stream')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'stream'
                ? 'bg-gradient-to-r from-red-500 to-amber-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.35)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            Câmera do Rio
          </button>
          <button
            onClick={() => setActiveTab('portals')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'portals'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Portais das Barragens
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="mt-6 relative z-10">
        {activeTab === 'stream' ? (
          <div className="space-y-4">
            {/* Live Streaming Video Container */}
            <div className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
              <iframe
                className="w-full h-full border-0"
                src="https://www.youtube.com/embed/videoseries?list=PL_XQ6Oa-d4B4e1qV8t2_y8t6N2W1K_3Xy"
                title="Câmera ao vivo do Rio Itajaí-Açu em Blumenau / Vale do Itajaí"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Live Streaming Banner & YouTube Direct Link */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 shrink-0">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">
                    Transmissão em Tempo Real do Rio Itajaí-Açu
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Monitoramento da calha do rio na Beira-Rio em Blumenau e região do Vale.
                  </p>
                </div>
              </div>

              <a
                href="https://www.youtube.com/@BNUtvOficial/streams"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30 transition-all shrink-0 cursor-pointer shadow-md"
              >
                <Video className="w-3.5 h-3.5" />
                Abrir no YouTube ao Vivo
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ) : (
          /* Portals Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEFESA_CIVIL_PORTALS.map((portal) => (
              <div
                key={portal.id}
                className={`p-5 rounded-2xl bg-gradient-to-br ${portal.color} border flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] shadow-lg`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full bg-slate-950/60 border border-white/10 text-slate-300">
                      {portal.badge}
                    </span>
                    <ShieldAlert className="w-4 h-4 text-slate-400" />
                  </div>
                  <h4 className="text-base font-black text-slate-100 mb-1">
                    {portal.title}
                  </h4>
                  <p className="text-xs text-slate-300 opacity-90 line-clamp-2 mb-4 leading-relaxed font-medium">
                    {portal.description}
                  </p>
                </div>

                <a
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-xs font-extrabold bg-slate-950/80 text-slate-100 border border-white/10 hover:bg-slate-900 hover:border-cyan-500/40 transition-all cursor-pointer shadow-md"
                >
                  Acessar Portal Oficial da Defesa Civil
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
