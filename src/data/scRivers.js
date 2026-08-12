/**
 * Mapeamento das Cidades de Santa Catarina com suas respectivas bacias hidrográficas
 * e rios principais monitorados.
 */

export const CITY_RIVER_MAPPING = {
  florianopolis: {
    riverName: 'Rio Cubatão do Sul & Bacia Insular',
    basinName: 'Bacia da Baía Norte/Sul',
    description: 'Monitoramento de cabeceiras e descarga estuarina na Grande Florianópolis.',
    mainThreat: 'Maré alta combinada com precipitação intensa.',
    normalDischargeMean: 15.0
  },
  blumenau: {
    riverName: 'Rio Itajaí-Açu',
    basinName: 'Bacia do Rio Itajaí',
    description: 'Monitoramento fluviométrico do Rio Itajaí-Açu em Blumenau (Ponte de Ferro / Centro).',
    mainThreat: 'Elevação rápida por chuvas acumuladas no Alto e Médio Vale.',
    normalDischargeMean: 220.0
  },
  joinville: {
    riverName: 'Rio Cachoeira & Cubatão Norte',
    basinName: 'Bacia do Rio Cubatão Norte',
    description: 'Monitoramento dos rios urbanos e estuário do Babitonga em Joinville.',
    mainThreat: 'Alagamentos por maré astronômica e enxurradas urbanas.',
    normalDischargeMean: 45.0
  },
  chapeco: {
    riverName: 'Rio Uruguai / Rio Chapecó',
    basinName: 'Bacia Hidrográfica do Rio Uruguai',
    description: 'Monitoramento da calha do Rio Uruguai e afluentes no Oeste de SC.',
    mainThreat: 'Vazões elevadas acumuladas de tempestades no planalto.',
    normalDischargeMean: 350.0
  },
  riodosul: {
    riverName: 'Rio Itajaí-Açu / Itajaí do Sul',
    basinName: 'Bacia do Alto Vale do Itajaí',
    description: 'Ponto crítico de convergência dos rios do Sul e do Oeste no Alto Vale.',
    mainThreat: 'Enchentes severas por convergência das barragens de Taió e Ituporanga.',
    normalDischargeMean: 140.0
  },
  criciuma: {
    riverName: 'Rio Sangão / Bacia do Rio Urussanga',
    basinName: 'Bacia do Rio Araranguá e Urussanga',
    description: 'Monitoramento do fluxo no Sul Catarinense.',
    mainThreat: 'Enxurradas e transbordamento de canais urbanos.',
    normalDischargeMean: 25.0
  },
  lages: {
    riverName: 'Rio Caveiras & Rio Carahá',
    basinName: 'Bacia do Rio Canoas',
    description: 'Monitoramento da bacia do Rio Caveiras no Planalto Serrano.',
    mainThreat: 'Transbordamento do Rio Carahá em áreas urbanas baixas.',
    normalDischargeMean: 60.0
  },
  itajai: {
    riverName: 'Rio Itajaí-Açu (Foz) & Rio Itajaí-Mirim',
    basinName: 'Bacia da Foz do Rio Itajaí',
    description: 'Seção final de deságue da maior bacia hidrográfica de SC no Oceano Atlântico.',
    mainThreat: 'Efeito represa por maré alta e grande vazão vinda do Vale.',
    normalDischargeMean: 280.0
  },
  jaraguadosul: {
    riverName: 'Rio Itapocu & Rio Jaraguá',
    basinName: 'Bacia do Rio Itapocu',
    description: 'Monitoramento fluviométrico do Rio Itapocu no Norte de SC.',
    mainThreat: 'Elevação rápida por precipitação na Serra do Mar.',
    normalDischargeMean: 55.0
  },
  tubarao: {
    riverName: 'Rio Tubarão',
    basinName: 'Bacia Hidrográfica do Rio Tubarão',
    description: 'Monitoramento do principal rio da Região Sul de Santa Catarina.',
    mainThreat: 'Enchentes por chuvas concentradas na encosta da Serra do Rio do Rastro.',
    normalDischargeMean: 110.0
  },
  saojose: {
    riverName: 'Rio Cubatão do Sul',
    basinName: 'Bacia do Rio Cubatão do Sul',
    description: 'Captação de água e fluxo fluviométrico da Grande Florianópolis.',
    mainThreat: 'Enxurradas e enchentes relâmpago.',
    normalDischargeMean: 20.0
  },
  palhoca: {
    riverName: 'Rio Passa Vinte & Rio Cubatão',
    basinName: 'Bacia da Grande Florianópolis',
    description: 'Monitoramento dos rios da planície costeira de Palhoça.',
    mainThreat: 'Alagamentos em dias de chuva forte com maré cheia.',
    normalDischargeMean: 18.0
  },
  balneariocamboriu: {
    riverName: 'Rio Camboriú',
    basinName: 'Bacia do Rio Camboriú',
    description: 'Monitoramento da vazão do Rio Camboriú (abastecimento e nível).',
    mainThreat: 'Variação brusca no nível e risco de intrusão salina em estiagens.',
    normalDischargeMean: 12.0
  },
  'concórdia': {
    riverName: 'Rio dos Queimados / Rio Jacutinga',
    basinName: 'Bacia do Rio Uruguai',
    description: 'Monitoramento dos rios do Meio-Oeste catarinense.',
    mainThreat: 'Enxurradas rápidas em vales estreitos.',
    normalDischargeMean: 30.0
  },
  joacaba: {
    riverName: 'Rio do Peixe',
    basinName: 'Bacia do Rio do Peixe',
    description: 'Monitoramento do Rio do Peixe cortando o centro urbano de Joaçaba e Herval d\'Oeste.',
    mainThreat: 'Transbordamento da calha urbana em precipitações volumosas.',
    normalDischargeMean: 85.0
  },
  saojoaquim: {
    riverName: 'Rio Pelotas & Cabeceiras',
    basinName: 'Bacia das Nascentes do Rio Pelotas',
    description: 'Monitoramento de cabeceira de alta altitude na Serra Catarinense.',
    mainThreat: 'Vazão torrencial pós-descongelamento / chuvas fortes.',
    normalDischargeMean: 40.0
  },
  urubici: {
    riverName: 'Rio Urubici & Canoas',
    basinName: 'Bacia das Nascentes do Rio Canoas',
    description: 'Cabeceiras dos principais rios formadores da Bacia do Uruguai.',
    mainThreat: 'Enxurradas de vale.',
    normalDischargeMean: 28.0
  },
  canoinhas: {
    riverName: 'Rio Canoinhas & Rio Iguaçu',
    basinName: 'Bacia do Rio Iguaçu',
    description: 'Monitoramento fluviométrico do Planalto Norte Catarinense.',
    mainThreat: 'Elevação gradual e cheias prolongadas.',
    normalDischargeMean: 70.0
  }
};

export function getRiverMetadata(cityId, cityName) {
  if (cityId && CITY_RIVER_MAPPING[cityId]) {
    return CITY_RIVER_MAPPING[cityId];
  }
  
  // Fallback genérico para localizações via GPS ou cidades não catalogadas
  return {
    riverName: `Rio Principal da Região (${cityName})`,
    basinName: 'Bacia Hidrográfica Local',
    description: `Monitoramento de descarga e fluxo fluvial na região de ${cityName}.`,
    mainThreat: 'Verificar avisos da Defesa Civil local.',
    normalDischargeMean: 50.0
  };
}
