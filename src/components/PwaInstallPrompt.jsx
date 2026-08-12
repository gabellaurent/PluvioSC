import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, Share, PlusSquare, Check } from 'lucide-react';

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
    if (dismissed && Date.now() - parseInt(dismissed, 10) < 86400000 * 7) {
      // Ignora por 7 dias se o usuário fechou
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

    // 5. Detecta se é iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    if (isIosDevice && !isStandalone) {
      setIsIos(true);
      setShowPrompt(true);
    }

    // 6. Detecta se o app foi instalado com sucesso
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

    if (!deferredPrompt) {
      // Fallback se o navegador nao disparou o evento automatico
      alert('Para instalar: abra o menu do seu navegador e clique em "Adicionar à tela inicial".');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstalled(true);
    }
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pluviosc_pwa_dismissed', Date.now().toString());
  };

  if (!showPrompt || installed) return null;

  return (
    <>
      {/* Bottom Floating Glassmorphism Install Toast */}
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-bounce-subtle">
        <div className="glass-card p-4 bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-cyan-950/90 border border-cyan-400/40 shadow-[0_15px_40px_rgba(6,182,212,0.3)]">
          <div className="flex items-start gap-3">
            
            {/* App Icon */}
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl shadow-lg shrink-0 border border-cyan-300/40">
              🌧️
            </div>

            {/* Text & Action */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-100 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  Instalar App PluvioSC
                </h4>
                <button
                  onClick={handleDismiss}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300 font-medium mt-1 leading-snug">
                Adicione à sua tela inicial para acessar o monitoramento de chuva direto do celular, sem abrir o navegador!
              </p>

              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={handleInstallClick}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] active:scale-95 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Instalar Aplicativo</span>
                </button>

                <button
                  onClick={handleDismiss}
                  className="py-2 px-3 rounded-xl text-xs font-semibold bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800"
                >
                  Agora não
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Modal de Instrução do iOS Safari */}
      {showIosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-card p-6 max-w-sm w-full border-cyan-400/50 bg-slate-900 text-slate-100 relative">
            <button
              onClick={() => setShowIosModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-2 text-2xl">
                📱
              </div>
              <h3 className="text-lg font-bold">Instalar no iPhone / iPad</h3>
              <p className="text-xs text-slate-400 mt-1">Siga os 2 passos simples no Safari:</p>
            </div>

            <div className="space-y-3 text-xs bg-slate-950/60 p-3.5 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 shrink-0">
                  <Share className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-slate-200">1. Toque em Compartilhar</strong>
                  <span className="text-slate-400">Clique no ícone de compartilhamento no menu inferior do Safari.</span>
                </div>
              </div>

              <div className="flex items-center gap-3 border-t border-white/5 pt-2.5">
                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-slate-200">2. Adicionar à Tela de Início</strong>
                  <span className="text-slate-400">Role para baixo e toque em "Adicionar à Tela de Início".</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIosModal(false)}
              className="w-full mt-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
            >
              Entendi!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
