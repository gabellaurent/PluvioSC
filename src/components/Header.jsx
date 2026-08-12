import React, { useState, useEffect } from 'react';
import { CloudRain, MapPin, Navigation, RefreshCw, Activity, Smartphone } from 'lucide-react';
import { SC_CITIES } from '../data/scCities';

export default function Header({ 
  selectedCity, 
  onSelectCity, 
  onUseGps, 
  onRefresh, 
  loading, 
  isGpsActive,
  lastUpdated 
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    // Detecta se a página foi rolada (scroll)
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Detecta se o aplicativo já está instalado / rodando em modo Standalone
    const checkInstalled = () => {
      const isStandalone = 
        window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone ||
        document.referrer.includes('android-app://');
      if (isStandalone) {
        setIsAppInstalled(true);
      }
    };

    checkInstalled();
    window.addEventListener('appinstalled', () => setIsAppInstalled(true));

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`glass-header sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'py-2 border-b border-cyan-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)]' : 'py-3.5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-row items-center justify-between gap-3">
        
        {/* Left Side: Brand Logo (normal) ou Compact Location Pill (ao rolar no mobile) */}
        <div className="flex items-center gap-2.5">
          {!isScrolled ? (
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-blue-600 shadow-[0_0_20px_rgba(6,182,212,0.35)] border border-cyan-300/30 shrink-0">
                <CloudRain className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-float" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-gradient-cyan">
                    PluvioSC
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    <Activity className="w-2.5 h-2.5 animate-pulse" />
                    Ao Vivo
                  </span>
                </div>
                <p className="hidden md:block text-xs font-medium text-slate-400">
                  Monitoramento Pluviométrico & Acumulados de Chuva em SC
                </p>
              </div>
            </div>
          ) : (
            /* Compact Header State when Scrolled */
            <div className="flex items-center gap-2 text-cyan-300 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-cyan-500/30 shadow-inner">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0 animate-bounce-subtle" />
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-black text-white">{selectedCity.name}</span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">• {selectedCity.region}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: City Selector + Controls */}
        <div className="flex items-center gap-2">
          
          {/* City Dropdown */}
          <div className="relative">
            <select
              value={isGpsActive ? 'gps' : selectedCity.id}
              onChange={(e) => {
                const cityId = e.target.value;
                if (cityId !== 'gps') {
                  const city = SC_CITIES.find(c => c.id === cityId);
                  if (city) onSelectCity(city);
                }
              }}
              className="pl-3 pr-7 py-1.5 sm:py-2 text-xs font-bold rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-100 focus:outline-none focus:border-cyan-400 cursor-pointer appearance-none max-w-[140px] sm:max-w-[200px] truncate"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2338bdf8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '0.9em'
              }}
            >
              {isGpsActive && (
                <option value="gps">📍 GPS Atual</option>
              )}
              <optgroup label="Cidades de Santa Catarina">
                {SC_CITIES.map((city) => (
                  <option key={city.id} value={city.id} className="bg-slate-900 text-slate-100">
                    {city.name} {city.capital ? '⭐' : ''}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* GPS Button */}
          <button
            onClick={onUseGps}
            title="Usar GPS"
            className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
              isGpsActive
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50'
                : 'bg-slate-900/80 text-slate-300 border-slate-700/80 hover:bg-slate-800'
            }`}
          >
            <Navigation className={`w-3.5 h-3.5 ${isGpsActive ? 'text-cyan-400 animate-spin-slow' : ''}`} />
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={loading}
            title="Atualizar dados"
            className="p-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 text-white border border-cyan-400/30 shadow-md active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Botão Baixar App (Só aparece se NÃO estiver instalado!) */}
          {!isAppInstalled && (
            <button
              onClick={() => {
                localStorage.removeItem('pluviosc_pwa_dismissed');
                window.dispatchEvent(new Event('beforeinstallprompt'));
                window.location.reload();
              }}
              title="Instalar aplicativo"
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md uppercase tracking-wider"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>App</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
