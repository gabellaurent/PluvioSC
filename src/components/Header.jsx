import React from 'react';
import { CloudRain, MapPin, Navigation, RefreshCw, Sparkles, Activity, Smartphone } from 'lucide-react';
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
  return (
    <header className="glass-header sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo Section */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-blue-600 shadow-[0_0_25px_rgba(6,182,212,0.35)] border border-cyan-300/30">
            <CloudRain className="w-6 h-6 text-white animate-float" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-400 border-2 border-slate-950"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-gradient-cyan">
                PluvioSC
              </h1>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]">
                <Activity className="w-2.5 h-2.5 animate-pulse" />
                Ao Vivo SC
              </span>
            </div>
            <p className="text-xs font-medium text-slate-400">
              Monitoramento Pluviométrico & Acumulados de Chuva em Santa Catarina
            </p>
          </div>
        </div>

        {/* Right Controls: City Selector + GPS + Refresh */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 w-full md:w-auto">
          
          {/* City Selector */}
          <div className="relative min-w-[220px] flex-1 md:flex-none">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cyan-400">
              <MapPin className="w-4 h-4" />
            </div>
            <select
              value={isGpsActive ? 'gps' : selectedCity.id}
              onChange={(e) => {
                const cityId = e.target.value;
                if (cityId !== 'gps') {
                  const city = SC_CITIES.find(c => c.id === cityId);
                  if (city) onSelectCity(city);
                }
              }}
              className="w-full pl-10 pr-9 py-2.5 text-xs font-semibold rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-100 shadow-inner focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 cursor-pointer transition-all appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2338bdf8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.8rem center',
                backgroundSize: '1em'
              }}
            >
              {isGpsActive && (
                <option value="gps">📍 Localização Atual (GPS)</option>
              )}
              <optgroup label="Cidades de Santa Catarina">
                {SC_CITIES.map((city) => (
                  <option key={city.id} value={city.id} className="bg-slate-900 text-slate-100">
                    {city.name} {city.capital ? '⭐ (Capital)' : ''} — {city.region}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* GPS Button */}
          <button
            onClick={onUseGps}
            title="Usar geolocalização do dispositivo"
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
              isGpsActive
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'bg-slate-900/80 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-white hover:border-slate-600'
            }`}
          >
            <Navigation className={`w-3.5 h-3.5 ${isGpsActive ? 'text-cyan-400 animate-spin-slow' : ''}`} />
            <span>GPS</span>
          </button>

          {/* Baixar App Button Prominent */}
          <button
            onClick={() => {
              localStorage.removeItem('pluviosc_pwa_dismissed');
              window.dispatchEvent(new Event('beforeinstallprompt'));
              window.location.reload();
            }}
            title="Instalar aplicativo na tela inicial"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)] active:scale-95 transition-all cursor-pointer uppercase tracking-wider"
          >
            <Smartphone className="w-4 h-4 text-slate-950" />
            <span>Baixar App</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={loading}
            title="Atualizar dados pluviométricos"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border border-cyan-400/30 shadow-[0_4px_14px_rgba(6,182,212,0.3)] active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Atualizar</span>
          </button>

          {/* Last updated badge */}
          {lastUpdated && (
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{lastUpdated}</span>
            </div>
          )}

        </div>

      </div>
    </header>
  );
}
