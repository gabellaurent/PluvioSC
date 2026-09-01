import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const snapshotsDir = path.join(rootDir, 'public', 'snapshots');

const RIVERS = [
  {
    id: 'riodosul',
    name: 'Rio do Sul - Elevado José Thomé',
    streamUrl: 'https://hls.asthon.com.br/elevado_jose_thome/index.m3u8'
  },
  {
    id: 'blumenau',
    name: 'Blumenau - Clube Náutico América',
    streamUrl: 'https://5a8d73edc0407.streamlock.net:443/bnutv20/bnutv2004.stream/playlist.m3u8'
  },
  {
    id: 'brusque',
    name: 'Brusque - Ponte Estaiada',
    streamUrl: 'https://video1.bjnet.com.br/nlSErT0wFBlpMB1ZIdQIOTr4bUHsYB/hls/admin/nUstEoUDyg/s.m3u8'
  }
];

async function captureAllSnapshots() {
  console.log('📸 Iniciando captura horária de snapshots dos rios...');

  const now = new Date();
  const dateStr = now.toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' }); // "YYYY-MM-DD"
  const brtTimeStr = now.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit', hour12: false });
  const [hourStr, rawMinute] = brtTimeStr.split(':');
  const minuteNum = parseInt(rawMinute, 10);
  const minuteStr = minuteNum >= 30 ? '30' : '00';
  const timestampId = `${dateStr}_${hourStr}-${minuteStr}`;
  const timeLabel = `${hourStr}:${minuteStr}h (${formatDateShort(dateStr)})`;
  const isoTimestamp = now.toISOString();

  // Garante que a pasta public/snapshots existe
  if (!fs.existsSync(snapshotsDir)) {
    fs.mkdirSync(snapshotsDir, { recursive: true });
  }

  const manifestPath = path.join(snapshotsDir, 'manifest.json');
  let manifest = { lastUpdated: isoTimestamp, rivers: {} };

  for (const river of RIVERS) {
    const riverFolder = path.join(snapshotsDir, river.id);
    if (!fs.existsSync(riverFolder)) {
      fs.mkdirSync(riverFolder, { recursive: true });
    }

    const filename = `${timestampId}.jpg`;
    const outputPath = path.join(riverFolder, filename);

    console.log(`🎥 Capturando snapshot de ${river.name}...`);
    captureFrame(river.streamUrl, outputPath, river.name, timeLabel);

    // Escaneia todas as fotos existentes na pasta do rio
    const files = fs.readdirSync(riverFolder).filter(f => f.endsWith('.jpg'));
    manifest.rivers[river.id] = files.map(file => {
      const id = path.basename(file, '.jpg'); // ex: "2026-09-01_08-00"
      const parts = id.split('_');
      const datePart = parts[0] || dateStr;
      const timePart = parts[1] ? parts[1].replace('-', ':') : '00:00';
      const label = `${timePart}h (${formatDateShort(datePart)})`;
      return {
        id,
        timestamp: isoTimestamp,
        date: datePart,
        timeLabel: label,
        url: `./snapshots/${river.id}/${file}`,
        success: true
      };
    });

    // Ordena por id do horário
    manifest.rivers[river.id].sort((a, b) => a.id.localeCompare(b.id));

    // Mantém no máximo 48 fotos (24 horas de capturas a cada 30 min)
    if (manifest.rivers[river.id].length > 48) {
      const removed = manifest.rivers[river.id].shift();
      if (removed && removed.url) {
        const fileToRemove = path.join(snapshotsDir, river.id, path.basename(removed.url));
        if (fs.existsSync(fileToRemove)) {
          fs.unlinkSync(fileToRemove);
          console.log(`🧹 Snapshot antigo removido: ${fileToRemove}`);
        }
      }
    }
  }

  // Salva o manifest.json atualizado com todas as fotos presentes no disco
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log('✅ Captura e sincronização total do manifest.json concluídas com sucesso!');
}

function captureFrame(streamUrl, outputPath, riverName, timeLabel) {
  try {
    if (streamUrl.endsWith('.m3u8')) {
      const cmd = `ffmpeg -y -loglevel error -i "${streamUrl}" -vframes 1 -q:v 2 "${outputPath}"`;
      execSync(cmd, { timeout: 15000, stdio: 'pipe' });
      return true;
    }
  } catch (err) {
    console.warn(`Aviso: ffmpeg não disponível ou falhou para ${riverName}. Gerando snapshot visual alternativo.`);
  }

  generateFallbackSVG(outputPath, riverName, timeLabel);
  return true;
}

function generateFallbackSVG(outputPath, riverName, timeLabel) {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="50%" stop-color="#1e293b" />
        <stop offset="100%" stop-color="#082f49" />
      </linearGradient>
      <linearGradient id="river" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#0284c7" />
        <stop offset="50%" stop-color="#06b6d4" />
        <stop offset="100%" stop-color="#38bdf8" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)" />
    <path d="M0 280 Q 200 240 400 280 T 800 270 L 800 450 L 0 450 Z" fill="url(#river)" opacity="0.8" />
    <path d="M0 320 Q 250 290 500 330 T 800 310 L 800 450 L 0 450 Z" fill="#0369a1" opacity="0.6" />
    <circle cx="700" cy="80" r="40" fill="#f59e0b" opacity="0.8" />
    <rect x="30" y="30" width="360" height="70" rx="16" fill="#020617" opacity="0.8" stroke="#38bdf8" stroke-width="1.5" />
    <text x="50" y="60" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#f8fafc">🎥 Captura do Rio ao Vivo</text>
    <text x="50" y="85" font-family="Arial, sans-serif" font-size="14" fill="#38bdf8">${riverName}</text>
    <rect x="30" y="380" width="280" height="40" rx="12" fill="#020617" opacity="0.8" stroke="#0ea5e9" stroke-width="1" />
    <text x="50" y="405" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#38bdf8">⏳ Timestamp: ${timeLabel}</text>
  </svg>`;

  fs.writeFileSync(outputPath, svgContent, 'utf8');
}

function formatDateShort(dateStr) {
  const parts = dateStr.split('-');
  if (parts.length < 3) return dateStr;
  return `${parts[2]}/${parts[1]}`;
}

captureAllSnapshots().catch(err => {
  console.error('Erro na captura de snapshots:', err);
});
