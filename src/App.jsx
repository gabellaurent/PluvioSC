import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import MobileDashboard from './components/MobileDashboard';
import MobileQuickSummary from './components/MobileQuickSummary';
import AccumulatedCards from './components/AccumulatedCards';
import RiskAlertBanner from './components/RiskAlertBanner';
import ForecastWidget from './components/ForecastWidget';
import RiverLevelWidget from './components/RiverLevelWidget';
import TimelapseWidget from './components/TimelapseWidget';
import PrecipitationCharts from './components/PrecipitationCharts';
import DataTable from './components/DataTable';
import PwaInstallPrompt from './components/PwaInstallPrompt';
import Footer from './components/Footer';
import { SC_CITIES, DEFAULT_CITY } from './data/scCities';
import { fetchPluviometryData } from './services/openMeteo';
import { fetchRiverData } from './services/riverService';
import { AlertCircle, CloudRain, Droplets, Loader2, MapPin, RefreshCw, Thermometer, Wind } from 'lucide-react';

export default function App() {
  const [selectedCity, setSelectedCity] = useState(() => {
    const savedId = localStorage.getItem('pluviosc_favorite_city');
    if (savedId) {
      const found = SC_CITIES.find(c => c.id === savedId);
      if (found) return found;
    }
    return DEFAULT_CITY; // Itajaí SC
  });
  const [isGpsActive, setIsGpsActive] = useState(false);
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [riverData, setRiverData] = useState(null);
  const [riverLoading, setRiverLoading] = useState(true);
  const [riverError, setRiverError] = useState(null);

  const loadData = useCallback(async (cityObj) => {
    try {
      setLoading(true);
      setRiverLoading(true);
      setError(null);
      setRiverError(null);

      const [pluvioResult, riverResult] = await Promise.allSettled([
        fetchPluviometryData(cityObj.lat, cityObj.lon),
        fetchRiverData(cityObj.lat, cityObj.lon, cityObj.id, cityObj.name)
      ]);

      if (pluvioResult.status === 'fulfilled') {
        setData(pluvioResult.value);
      } else {
        setError(pluvioResult.reason?.message || 'Falha ao buscar dados meteorológicos.');
      }

      if (riverResult.status === 'fulfilled') {
        setRiverData(riverResult.value);
      } else {
        console.error('Erro ao carregar dados dos rios:', riverResult.reason);
        setRiverError('Informações da bacia hidrográfica indisponíveis no momento.');
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError(err.message || 'Erro inesperado.');
    } finally {
      setLoading(false);
      setRiverLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(selectedCity);
  }, [selectedCity, loadData]);

  const handleSelectCity = (city) => {
    setIsGpsActive(false);
    setSelectedCity(city);
    if (city.id && !city.id.startsWith('gps')) {
      localStorage.setItem('pluviosc_favorite_city', city.id);
    }
  };

  const handleUseGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não é suportada pelo seu navegador.');
      return;
    }

    setLoading(true);
    setRiverLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const customGpsCity = {
          id: 'gps-custom',
          name: 'Sua Localização GPS',
          region: 'Coordenadas Atuais',
          lat,
          lon
        };
        setIsGpsActive(true);
        setSelectedCity(customGpsCity);
      },
      (err) => {
        console.error('Erro de geolocalização:', err);
        alert('Não foi possível obter sua localização GPS. Verifique as permissões.');
        setLoading(false);
        setRiverLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-cyan-500 selection:text-white">
      {/* Top Header Bar */}
      <Header
        selectedCity={selectedCity}
        onSelectCity={handleSelectCity}
        onUseGps={handleUseGps}
        onRefresh={() => loadData(selectedCity)}
        loading={loading}
        isGpsActive={isGpsActive}
        lastUpdated={data?.lastUpdated}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        
        {/* Weather Hero Card (WEB Only) */}
        <div className="hidden md:block glass-card-static p-5 lg:p-8 mb-4 relative overflow-hidden bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-cyan-950/40 border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            
            {/* Left Location Info */}
            <div className="flex items-start gap-4">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)] shrink-0">
                <MapPin className="w-7 h-7 sm:w-8 sm:h-8 animate-float" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-100 tracking-tight">
                    {selectedCity.name}
                  </h2>
                  {selectedCity.capital && (
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                      Capital SC ⭐
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                  <span className="text-cyan-300 font-semibold">{selectedCity.region}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">Coordenadas: {selectedCity.lat.toFixed(4)}°, {selectedCity.lon.toFixed(4)}°</span>
                </p>
              </div>
            </div>

            {/* Right Live Weather Stats Pill */}
            {data?.current && (
              <div className="w-full lg:w-auto bg-slate-950/80 p-3.5 sm:p-4 rounded-2xl border border-white/10 flex items-center justify-between sm:justify-end gap-3 sm:gap-6 shadow-inner">
                {/* Temp */}
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Thermometer className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">Temp.</span>
                    <span className="font-black text-slate-100 text-sm sm:text-base">{data.current.temp} °C</span>
                  </div>
                </div>

                <div className="h-7 w-px bg-slate-800"></div>

                {/* Humidity */}
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">Umidade</span>
                    <span className="font-black text-slate-100 text-sm sm:text-base">{data.current.humidity}%</span>
                  </div>
                </div>

                <div className="h-7 w-px bg-slate-800"></div>

                {/* Condition */}
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    <CloudRain className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">Condição</span>
                    <span className="font-extrabold text-cyan-300 text-xs truncate max-w-[90px] sm:max-w-none">{data.current.weatherText}</span>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>

        {/* Loading Spinner */}
        {loading && !data && (
          <div className="glass-card p-16 my-8 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
            <h3 className="text-xl font-black text-slate-200">Buscando dados da Open-Meteo...</h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">Calculando acumulados diários, estatísticas e vazão dos rios em {selectedCity.name}</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="glass-card p-8 my-8 border-red-500/40 bg-red-950/20 text-center">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-red-200">Erro ao carregar dados meteorológicos</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">{error}</p>
            <button
              onClick={() => loadData(selectedCity)}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 inline mr-1" />
              Tentar Novamente
            </button>
          </div>
        )}

        {/* Loaded Dashboard Content */}
        {data && (
          <>
            {/* MOBILE LAYOUT (Apenas os 3 cards ultra simples) */}
            <div className="block md:hidden">
              <MobileDashboard
                data={data}
                selectedCity={selectedCity}
                riverData={riverData}
              />
            </div>

            {/* WEB DESKTOP LAYOUT (Layout completo) */}
            <div className="hidden md:block space-y-6">
              {/* Defesa Civil SC Risk Banner */}
              <RiskAlertBanner risk={data.risk} last24hMm={data.totals.last24hMm} />

              {/* Accumulated Rainfall Cards (Hoje, 24h, 7 dias, Mês, Instantânea) */}
              <AccumulatedCards totals={data.totals} current={data.current} />

              {/* Monitoramento do Nível & Vazão dos Rios */}
              <RiverLevelWidget
                riverData={riverData}
                loading={riverLoading}
                error={riverError}
                cityName={selectedCity.name}
              />

              {/* Timelapse 24h & Linha do Tempo Visual dos Rios */}
              <TimelapseWidget selectedCity={selectedCity} />

              {/* Dedicated 7-Day Forecast Widget */}
              <ForecastWidget forecast7Days={data.forecast7Days} />

              {/* Interactive Charts */}
              <PrecipitationCharts
                dailyData={data.dailyChartData}
                hourlyData={data.hourlyChartData}
              />

              {/* Detailed Data Table + CSV Download */}
              <DataTable
                dailyData={data.dailyChartData}
                cityName={selectedCity.name}
              />
            </div>
          </>
        )}

      </main>

      {/* PWA Install Suggestion Banner */}
      <PwaInstallPrompt />

      {/* Footer */}
      <Footer />
    </div>
  );
}
