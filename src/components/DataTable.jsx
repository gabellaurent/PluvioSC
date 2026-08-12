import React, { useState } from 'react';
import { Download, Table as TableIcon, Search, Filter, Sparkles } from 'lucide-react';

export default function DataTable({ dailyData = [], cityName = 'Santa Catarina' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyRain, setOnlyRain] = useState(false);

  const filteredData = dailyData.filter(item => {
    const matchesSearch = item.date.includes(searchTerm) || item.displayDate.includes(searchTerm);
    const matchesRain = onlyRain ? item.precipitation > 0 : true;
    return matchesSearch && matchesRain;
  });

  const downloadCSV = () => {
    const headers = ['Data', 'Precipitacao_mm', 'Probabilidade_Chuva_Pct', 'Tipo_Status'];
    const rows = dailyData.map(d => [
      d.date,
      d.precipitation,
      d.probability || 0,
      getRainStatus(d.precipitation).label
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pluviometria_${cityName.toLowerCase().replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="glass-card p-6 my-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <TableIcon className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xl font-bold text-slate-100">
              Histórico Detalhado de Pluviometria
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Registro diário de volume de chuva ($mm$) e acumulados em {cityName}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:flex-none min-w-[180px]">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar data (ex: 12/08)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-950/80 border border-slate-700/80 text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20"
            />
          </div>

          {/* Rain filter toggle */}
          <button
            onClick={() => setOnlyRain(!onlyRain)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
              onlyRain
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Apenas Dias com Chuva</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={downloadCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border border-cyan-400/30 shadow-[0_4px_14px_rgba(6,182,212,0.3)] active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80 max-h-96 overflow-y-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/90 text-slate-400 uppercase tracking-wider font-extrabold sticky top-0 backdrop-blur-md border-b border-slate-800">
            <tr>
              <th className="px-5 py-3.5">Data</th>
              <th className="px-5 py-3.5">Volume Acumulado</th>
              <th className="px-5 py-3.5">Probabilidade</th>
              <th className="px-5 py-3.5">Status Pluviométrico</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-950/40 font-medium">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-5 py-10 text-center text-slate-500">
                  Nenhum registro encontrado para o filtro selecionado.
                </td>
              </tr>
            ) : (
              filteredData.map((row, idx) => {
                const status = getRainStatus(row.precipitation);
                return (
                  <tr
                    key={idx}
                    className={`hover:bg-slate-900/80 transition-colors ${
                      row.isToday ? 'bg-cyan-500/10' : idx % 2 === 0 ? 'bg-slate-950/30' : 'bg-transparent'
                    }`}
                  >
                    <td className="px-5 py-3.5 text-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{row.displayDate}</span>
                        {row.isToday && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                            HOJE
                          </span>
                        )}
                        {row.isForecast && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                            PREVISÃO
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`font-black text-sm ${row.precipitation > 0 ? 'text-cyan-400' : 'text-slate-500'}`}>
                        {row.precipitation} mm
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300 font-semibold">
                      {row.probability}%
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${status.badgeStyle}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dotColor}`}></span>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function getRainStatus(mm) {
  if (mm === 0) {
    return {
      label: 'Sem Chuva ☀️',
      badgeStyle: 'bg-slate-900/60 text-slate-400 border-slate-800',
      dotColor: 'bg-slate-500'
    };
  }
  if (mm < 5) {
    return {
      label: 'Garoa Leve 🌤️',
      badgeStyle: 'bg-blue-950/40 text-blue-300 border-blue-500/30',
      dotColor: 'bg-blue-400'
    };
  }
  if (mm < 25) {
    return {
      label: 'Chuva Moderada 🌧️',
      badgeStyle: 'bg-cyan-950/50 text-cyan-300 border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]',
      dotColor: 'bg-cyan-400'
    };
  }
  if (mm < 50) {
    return {
      label: 'Chuva Forte ⛈️',
      badgeStyle: 'bg-amber-950/50 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
      dotColor: 'bg-amber-400'
    };
  }
  return {
    label: 'Chuva Volumosa 🚨',
    badgeStyle: 'bg-red-950/60 text-red-200 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]',
    dotColor: 'bg-red-400'
  };
}
