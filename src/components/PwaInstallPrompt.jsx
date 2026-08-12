import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, Share, PlusSquare, Sparkles, Zap, CheckCircle2 } from 'lucide-react';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // 1. Registra o Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/PluvioSC/sw.js')
        .then(() => console.log('PWA Service Worker registrado!'))
        .catch((err) => console.log('Falha ao registrar Service Worker:', err));
    }

    // 2. Verifica se o usuário já fechou a mensagem recentemente
    const dismissed = localStorage.getItem('pluviosc_pwa_dismissed');
    if (dismissed && Date.now() - parseInt(dismissed, 10) < 86400000 * 3) {
      // Reaparece após 3 dias se fechado
      return;
    }

    // 3. Verifica se já está rodando como app instalado (standalone)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) {
      return;
    }

    // 4. Captura o evento nativo do Android / Chrome / Edge
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 5. Detecta se é iOS Safari ou se é navegador mobile/desktop normal
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    if (isIosDevice && !isStandalone) {
      setIsIos(true);
      setShowPrompt(true);
    } else {
      // Exibe por padrão em navegadores para incentivar o uso como PWA
      setShowPrompt(true);
    }

    // 6. Evento de instalação concluída
    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosModal(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstalled(true);
      }
      setDeferredPrompt(null);
      setShowPrompt(false);
    } else {
      // Fallback amigavel se o navegador nao deu suporte ao prompt direto
      alert('📱 Para Instalar o App PluvioSC:\n\n1. Abra o menu do seu navegador (3 pontinhos ou botão de opções).\n2. Clique em "Adicionar à Tela Inicial" ou "Instalar Aplicativo".');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pluviosc_pwa_dismissed', Date.now().toString());
  };

  if (!showPrompt || installed) return null;

  return (
    <>
      {/* High-Impact Floating Banner (Bottom / Center Overlay) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent backdrop-blur-xl border-t border-cyan-500/40 shadow-[0_-15px_50px_rgba(0,0,0,0.8)] transition-all animate-bounce-subtle">
        <div className="max-w-4xl mx-auto glass-card p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950 border-2 border-cyan-400/60 shadow-[0_0_50px_rgba(6,182,212,0.35)] relative overflow-hidden">
          
          {/* Ambient Glow Effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

          {/* Close X Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3.5 right-3.5 p-2 rounded-xl bg-slate-950/80 text-slate-400 hover:text-white border border-white/10 transition-colors z-20"
            title="Fechar aviso"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
            
            {/* Left Column: App Icon & Headlines */}
            <div className="flex items-center gap-4 text-left w-full sm:w-auto">
              
              {/* App Icon Large Glowing */}
              <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 via-sky-400 to-blue-600 shadow-[0_0_30px_rgba(6,182,212,0.6)] border-2 border-white/30 shrink-0">
                <span className="text-3xl sm:text-4xl animate-float">🌧️</span>
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-400 border-2 border-slate-950"></span>
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center gap-1 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                    <Zap className="w-3 h-3 text-cyan-400" />
                    RECOMENDADO
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    Instalação Grátis em 1-Clique
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
                  Instalar o App PluvioSC no seu Celular?
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5 max-w-lg leading-relaxed">
                  Tenha acesso instantâneo na tela inicial sem precisar abrir o navegador!
                </p>

                {/* Micro Features list */}
                <div className="hidden md:flex items-center gap-4 mt-2 text-[11px] font-semibold text-slate-300">
                  <span className="flex items-center gap-1 text-cyan-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Acesso Rápido 1-Toque
                  </span>
                  <span className="flex items-center gap-1 text-cyan-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Sem ocupar memória
                  </span>
                  <span className="flex items-center gap-1 text-cyan-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% Gratuito
                  </span>
                </div>
              </div>

            </div>

            {/* Right Column: CTA Install Button Large */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto shrink-0">
              <button
                onClick={handleInstallClick}
                className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl text-sm font-black bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-[0_0_30px_rgba(6,182,212,0.5)] active:scale-95 transition-all cursor-pointer uppercase tracking-wider"
              >
                <Download className="w-5 h-5" />
                <span>BAIXAR E INSTALAR AGORA</span>
              </button>

              <button
                onClick={handleDismiss}
                className="px-4 py-3 rounded-2xl text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-950/80 border border-slate-800 text-center"
              >
                Continuar no Navegador
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Modal de Instrução do iOS Safari */}
      {showIosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="glass-card p-6 max-w-sm w-full border-2 border-cyan-400/60 bg-slate-900 text-slate-100 relative shadow-[0_0_50px_rgba(6,182,212,0.3)]">
            <button
              onClick={() => setShowIosModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto mb-3 text-3xl shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                📱
              </div>
              <h3 className="text-xl font-black">Instalar no iPhone / iPad</h3>
              <p className="text-xs text-slate-400 mt-1">Siga estes 2 passos simples no Safari:</p>
            </div>

            <div className="space-y-3.5 text-xs bg-slate-950/80 p-4 rounded-2xl border border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0">
                  <Share className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-slate-200 text-sm">1. Toque em Compartilhar</strong>
                  <span className="text-slate-400">Clique no ícone de compartilhamento no menu do Safari.</span>
                </div>
              </div>

              <div className="flex items-center gap-3 border-t border-white/10 pt-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
                  <PlusSquare className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-slate-200 text-sm">2. Adicionar à Tela de Início</strong>
                  <span className="text-slate-400">Role para baixo e selecione "Adicionar à Tela de Início".</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIosModal(false)}
              className="w-full mt-4 py-3 rounded-xl text-xs font-black bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-colors uppercase tracking-wider"
            >
              Entendi, Entrar no App!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
