import React, { useState, useEffect } from 'react';
import { Camera, ExternalLink, ShieldAlert, Video, Radio, Eye, Layers, MapPin, Play } from 'lucide-react';

export default function LiveCamerasWidget({ selectedCity }) {
  const [activeTab, setActiveTab] = useState('cameras'); // 'cameras' | 'portals'
  const [selectedCameraId, setSelectedCameraId] = useState('riodosul');

  const CAMERAS = [
    {
      id: 'riodosul',
      cityName: 'Rio do Sul',
      title: 'Rio do Sul - Elevado José Thomé',
      riverName: 'Rio Itajaí-Açu / Itajaí do Sul',
      streamUrl: 'https://hls.asthon.com.br/elevado_jose_thome/index.m3u8',
      webUrl: 'https://hls.asthon.com.br/elevado_jose_thome/index.m3u8',
      type: 'hls',
      badge: 'Direto HLS 🔴',
      description: 'Fluxo de vídeo ao vivo HLS (.m3u8) no Elevado José Thomé em Rio do Sul.'
    },
    {
      id: 'blumenau',
      cityName: 'Blumenau',
      title: 'Blumenau - Clube Náutico América',
      riverName: 'Rio Itajaí-Açu (Remo / Beira-Rio)',
      streamUrl: 'https://5a8d73edc0407.streamlock.net:443/bnutv20/bnutv2004.stream/playlist.m3u8',
      webUrl: 'https://bnu.tv/blumenau/clube-nautico-america-remo-blumenau/',
      type: 'hls',
      badge: 'Direto HLS 🔴',
      description: 'Fluxo de vídeo ao vivo HLS (.m3u8) do Rio Itajaí-Açu no Clube Náutico América em Blumenau.'
    },
    {
      id: 'brusque',
      cityName: 'Brusque',
      title: 'Brusque - Ponte Estaiada',
      riverName: 'Rio Itajaí-Mirim',
      streamUrl: 'https://www.brusqueaovivo.com/cameras/sc/brusque/ponte-estaiada',
      webUrl: 'https://www.brusqueaovivo.com/cameras/sc/brusque/ponte-estaiada',
      type: 'iframe',
      badge: 'Brusque ao Vivo 🔴',
      description: 'Câmera em tempo real sobre o Rio Itajaí-Mirim na Ponte Estaiada em Brusque.'
    }
  ];

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

  // Seleção automática baseada na cidade atual se houver correspondente
  useEffect(() => {
    if (selectedCity?.id) {
      const match = CAMERAS.find(c => c.id === selectedCity.id || selectedCity.id.includes(c.id));
      if (match) {
        setSelectedCameraId(match.id);
      }
    }
  }, [selectedCity]);

  const currentCamera = CAMERAS.find(c => c.id === selectedCameraId) || CAMERAS[0];

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
                Câmeras ao Vivo do Rio & Portais da Defesa Civil
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.3)] animate-pulse">
                <Radio className="w-3 h-3" />
                🔴 AO VIVO
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Transmissões diretas dos rios em Rio do Sul, Blumenau, Brusque e barragens de SC
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1.5 rounded-2xl border border-white/10 shadow-inner shrink-0">
          <button
            onClick={() => setActiveTab('cameras')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'cameras'
                ? 'bg-gradient-to-r from-red-500 to-amber-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.35)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            Câmeras Diretas (3)
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
        {activeTab === 'cameras' ? (
          <div className="space-y-5">
            
            {/* Camera Selector Pills */}
            <div className="flex flex-wrap items-center gap-2 pb-2">
              {CAMERAS.map((cam) => {
                const isSelected = cam.id === selectedCameraId;
                return (
                  <button
                    key={cam.id}
                    onClick={() => setSelectedCameraId(cam.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.35)] scale-105'
                        : 'bg-slate-950/80 text-slate-300 border border-white/10 hover:border-cyan-500/40 hover:bg-slate-900'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{cam.cityName}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900/80 text-cyan-300 font-mono">
                      {cam.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Video Player Display Container */}
            <div className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col justify-center items-center">
              {currentCamera.type === 'hls' ? (
                <video
                  controls
                  autoPlay
                  muted
                  playsInline
                  key={currentCamera.id}
                  className="w-full h-full object-cover"
                  src={currentCamera.streamUrl}
                >
                  <p className="text-xs text-slate-400 p-4 text-center">
                    Seu navegador não suporta a reprodução direta do vídeo HLS. Use o botão abaixo para abrir a transmissão.
                  </p>
                </video>
              ) : (
                <iframe
                  key={currentCamera.id}
                  className="w-full h-full border-0"
                  src={currentCamera.streamUrl}
                  title={currentCamera.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>

            {/* Camera Details Card & Direct Link Button */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-inner">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0 mt-0.5">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-slate-100">
                      {currentCamera.title}
                    </h4>
                    <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {currentCamera.riverName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-1">
                    {currentCamera.description}
                  </p>
                </div>
              </div>

              <a
                href={currentCamera.webUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-red-500 to-amber-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:opacity-95 transition-all shrink-0 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Abrir Câmera Direta
                <ExternalLink className="w-3.5 h-3.5" />
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
