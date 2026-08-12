export const SC_CITIES = [
  { id: 'florianopolis', name: 'Florianópolis', region: 'Grande Florianópolis', lat: -27.5954, lon: -48.5480, capital: true },
  { id: 'blumenau', name: 'Blumenau', region: 'Vale do Itajaí', lat: -26.9194, lon: -49.0661 },
  { id: 'joinville', name: 'Joinville', region: 'Norte Catarinense', lat: -26.3045, lon: -48.8464 },
  { id: 'chapeco', name: 'Chapecó', region: 'Oeste Catarinense', lat: -27.1004, lon: -52.6152 },
  { id: 'riodosul', name: 'Rio do Sul', region: 'Alto Vale do Itajaí', lat: -27.2141, lon: -49.6433 },
  { id: 'criciuma', name: 'Criciúma', region: 'Sul Catarinense', lat: -28.6775, lon: -49.3703 },
  { id: 'lages', name: 'Lages', region: 'Serrana', lat: -27.8160, lon: -50.3260 },
  { id: 'itajai', name: 'Itajaí', region: 'Foz do Rio Itajaí', lat: -26.9078, lon: -48.6619 },
  { id: 'jaraguadosul', name: 'Jaraguá do Sul', region: 'Norte Catarinense', lat: -26.4853, lon: -49.0708 },
  { id: 'tubarao', name: 'Tubarão', region: 'Sul Catarinense', lat: -28.4742, lon: -49.0069 },
  { id: 'saojose', name: 'São José', region: 'Grande Florianópolis', lat: -27.6136, lon: -48.6366 },
  { id: 'palhoca', name: 'Palhoça', region: 'Grande Florianópolis', lat: -27.6469, lon: -48.6703 },
  { id: 'balneariocamboriu', name: 'Balneário Camboriú', region: 'Foz do Rio Itajaí', lat: -26.9926, lon: -48.6353 },
  { id: 'concórdia', name: 'Concórdia', region: 'Oeste Catarinense', lat: -27.2344, lon: -52.0286 },
  { id: 'joacaba', name: 'Joaçaba', region: 'Meio-Oeste', lat: -27.1775, lon: -51.5066 },
  { id: 'saojoaquim', name: 'São Joaquim', region: 'Serrana (Frio & Geada)', lat: -28.2936, lon: -49.9317 },
  { id: 'urubici', name: 'Urubici', region: 'Serrana (Serra do Rio do Rastro)', lat: -28.0147, lon: -49.5919 },
  { id: 'canoinhas', name: 'Canoinhas', region: 'Planalto Norte', lat: -26.1772, lon: -50.3897 }
];

export const DEFAULT_CITY = SC_CITIES.find(c => c.id === 'itajai') || SC_CITIES[0]; // Itajaí SC
