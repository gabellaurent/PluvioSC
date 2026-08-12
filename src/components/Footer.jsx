import React from 'react';
import { CloudRain, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-800/80 py-8 px-4 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <CloudRain className="w-5 h-5 text-cyan-400" />
          <span>
            <strong className="text-slate-300">PluvioSC</strong> — Monitoramento Pluviométrico de Santa Catarina.
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition-colors flex items-center gap-1"
          >
            <span>Dados: Open-Meteo API</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://www.defesacivil.sc.gov.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition-colors flex items-center gap-1"
          >
            <span>Defesa Civil SC</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://ciram.epagri.sc.gov.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition-colors flex items-center gap-1"
          >
            <span>Epagri/Ciram</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="text-center md:text-right text-slate-400">
          Atualizado via Open-Meteo Weather API
        </div>

      </div>
    </footer>
  );
}
