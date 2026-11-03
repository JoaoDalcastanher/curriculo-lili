import { greatCircleKm } from './geo'
import type { LatLon } from './types'

/**
 * Rede de pontos no mar por onde o Pingo nada depois da África.
 * Cada ligação é um trecho de oceano (verificado nos testes: nenhum trecho
 * passa por cima de terra). O caminho até cada destino é o mais curto nessa rede.
 */
export const SEA_NODES = {
  GAB: { lat: 0.54, lon: 8.32 },
  GG: { lat: 2, lon: 3 },
  LAG: { lat: 6.2, lon: 3.4 },
  WAF: { lat: 3.5, lon: -8 },
  DAK: { lat: 14.5, lon: -19.5 },
  CAN: { lat: 28.5, lon: -15.5 },
  MAR: { lat: 31.6, lon: -10.2 },
  POR: { lat: 38.5, lon: -10.5 },
  SVINC: { lat: 36.7, lon: -9.4 },
  SLEONE: { lat: 7, lon: -15 },
  GIBW: { lat: 36, lon: -7.5 },
  GIB: { lat: 35.95, lon: -5.5 },
  ALB: { lat: 36.3, lon: -1.5 },
  MURC: { lat: 37.6, lon: 0.6 },
  VAL: { lat: 39.4, lon: 0.2 },
  MEDW: { lat: 38, lon: 5 },
  SARD: { lat: 38.3, lon: 9.4 },
  TYR: { lat: 40.3, lon: 12.2 },
  ROM: { lat: 41.65, lon: 12.15 },
  SICS: { lat: 36.3, lon: 13.6 },
  TRIP: { lat: 33.2, lon: 13.2 },
  ION: { lat: 36.5, lon: 19 },
  MATA: { lat: 35.9, lon: 22.6 },
  KYTH: { lat: 35.6, lon: 23.0 },
  CRETS: { lat: 34.5, lon: 24.2 },
  MYRT: { lat: 36.3, lon: 23.7 },
  PIR: { lat: 37.75, lon: 23.6 },
  MEDE: { lat: 33.8, lon: 27 },
  NILE: { lat: 31.7, lon: 31.4 },
  SUEZN: { lat: 31.35, lon: 32.4 },
  SUEZS: { lat: 29.85, lon: 32.55 },
  RED1: { lat: 27, lon: 34.4 },
  RED2: { lat: 20, lon: 38.6 },
  RED3: { lat: 14, lon: 42.2 },
  BAB: { lat: 12.6, lon: 43.45 },
  ADEN: { lat: 12.3, lon: 45.5 },
  GADE: { lat: 13, lon: 50 },
  GUARD: { lat: 11.9, lon: 52.4 },
  ARAB: { lat: 14.5, lon: 57 },
  ARAB2: { lat: 18, lon: 60.6 },
  RASH: { lat: 23, lon: 60.4 },
  OMANG: { lat: 24.9, lon: 57.8 },
  HORMUZ: { lat: 26.75, lon: 56.5 },
  GULF: { lat: 26.35, lon: 55.6 },
  DUB: { lat: 25.4, lon: 55.1 },
  SOMALI: { lat: 2, lon: 52 },
  MOMB: { lat: -4.3, lon: 40.2 },
  ZAN: { lat: -10, lon: 42 },
  MADA: { lat: -19, lon: 43 },
  INDC: { lat: 8, lon: 70 },
  SRI: { lat: 5, lon: 80.6 },
  BENG: { lat: 14, lon: 88 },
  GANGES: { lat: 21.2, lon: 88.4 },
  ACEH: { lat: 5.9, lon: 94.3 },
  MALN: { lat: 5.8, lon: 98.8 },
  MAL: { lat: 2.6, lon: 101.2 },
  SING: { lat: 1.2, lon: 103.9 },
  SCS1: { lat: 5, lon: 106 },
  SCS2: { lat: 12, lon: 112 },
  SCS3: { lat: 19, lon: 116 },
  TWS: { lat: 24.3, lon: 119.6 },
  ECS: { lat: 29.5, lon: 124 },
  YEL: { lat: 35, lon: 123.5 },
  SHAN: { lat: 37.7, lon: 123.1 },
  BOH: { lat: 38.6, lon: 120.8 },
  TIAN: { lat: 38.9, lon: 118 },
  INCH: { lat: 37.4, lon: 126.3 },
  KYU: { lat: 30.3, lon: 129.5 },
  JPS: { lat: 31.5, lon: 134 },
  TOKOFF: { lat: 34.6, lon: 140 },
  TOK: { lat: 35.4, lon: 139.8 },
  NP1: { lat: 36, lon: 155 },
  NP2: { lat: 42, lon: 180 },
  NP3: { lat: 50, lon: -160 },
  GOA: { lat: 57, lon: -147 },
  COOK: { lat: 59.3, lon: -152.2 },
  ANC: { lat: 61, lon: -150.4 },
  HAWN: { lat: 23, lon: -156 },
  HAW: { lat: 21.2, lon: -158 },
  CALP: { lat: 26, lon: -140 },
  CALN: { lat: 40, lon: -140 },
  LAOFF: { lat: 33.4, lon: -119.4 },
  LA: { lat: 33.7, lon: -118.4 },
  SATL1: { lat: -8, lon: 9 },
  SATL2: { lat: -22, lon: 11 },
  CAPEOFF: { lat: -34.6, lon: 17.8 },
  CABO: { lat: -33.9, lon: 18.3 },
  AGU: { lat: -37, lon: 22 },
  INDS: { lat: -36, lon: 50 },
  INDSE: { lat: -36, lon: 90 },
  AUSW: { lat: -36, lon: 113 },
  AUSS: { lat: -38, lon: 130 },
  BASSW: { lat: -39.6, lon: 142 },
  BASSE: { lat: -39.2, lon: 149 },
  TASM: { lat: -37.8, lon: 151 },
  SYD: { lat: -33.9, lon: 151.4 },
  MATL: { lat: 28, lon: -40 },
  BERM: { lat: 32, lon: -64 },
  NYOFF: { lat: 40.2, lon: -73.3 },
  NY: { lat: 40.55, lon: -73.95 },
  MART: { lat: 15, lon: -61.2 },
  CAR: { lat: 15, lon: -72 },
  YUC: { lat: 21.5, lon: -86 },
  GOM: { lat: 24, lon: -92 },
  VER: { lat: 19.3, lon: -95.9 },
  NATL: { lat: 50, lon: -35 },
  FAREW: { lat: 58.5, lon: -44 },
  GRSW: { lat: 61, lon: -50 },
  NUUKOFF: { lat: 63.8, lon: -52.6 },
  NUUK: { lat: 64.15, lon: -51.9 },
  FIN: { lat: 43.6, lon: -10.5 },
  BISC: { lat: 46, lon: -6 },
  BREST: { lat: 48.3, lon: -6 },
  CHAN: { lat: 50, lon: -2.5 },
  LEHAVRE: { lat: 49.55, lon: -0.1 },
  DOVER: { lat: 51, lon: 1.5 },
  THAMES: { lat: 51.5, lon: 1.1 },
  NSEA: { lat: 54, lon: 4 },
  JUTW: { lat: 56.8, lon: 6.5 },
  ELBE: { lat: 54, lon: 8.3 },
  SKAG: { lat: 57.9, lon: 10.9 },
  KAT: { lat: 57, lon: 11.7 },
  ORES: { lat: 55.7, lon: 12.75 },
  BALT: { lat: 55.8, lon: 16 },
  GOTL: { lat: 57.5, lon: 19.6 },
  FINL: { lat: 59.5, lon: 24 },
  SPB: { lat: 59.95, lon: 29.6 },
  NORW: { lat: 62, lon: 3 },
  NOR2: { lat: 70, lon: 12 },
  SVAL: { lat: 78, lon: 3 },
  POLE: { lat: 89.9, lon: 0 },
  SAT3: { lat: -45, lon: 0 },
  ANT: { lat: -68.5, lon: 0 },
  // América do Sul, da Patagônia até o Nordeste, e a travessia até a África.
  PATOFF: { lat: -43.3, lon: -63.6 },
  SATS: { lat: -47.5, lon: -63.5 },
  MALVOFF: { lat: -51.4, lon: -56.8 },
  DRAKE: { lat: -55.6, lon: -63 },
  ARG2: { lat: -38.8, lon: -56.5 },
  URU: { lat: -35.6, lon: -53 },
  RSOFF: { lat: -31.5, lon: -49.5 },
  SCOFF: { lat: -27.6, lon: -47.9 },
  PROFF: { lat: -25.8, lon: -47.6 },
  RJOFF: { lat: -23.3, lon: -43.2 },
  CFRIO: { lat: -23.3, lon: -41.6 },
  ESOFF: { lat: -21, lon: -39.6 },
  ABROL: { lat: -18.5, lon: -37.5 },
  SSAOFF: { lat: -13.1, lon: -38.2 },
  MACOFF: { lat: -10.2, lon: -35.3 },
  PECOFF: { lat: -8, lon: -34.2 },
  NATOFF: { lat: -5.6, lon: -34.6 },
  EQ: { lat: 0, lon: -32 },
  MIDATL: { lat: 2, lon: -20 },
  // Pacífico: Cabo Horn, costa do Chile ao largo e a travessia até o Havaí.
  HORN: { lat: -57.3, lon: -66.5 },
  PACS0: { lat: -58, lon: -75 },
  PACS1: { lat: -50, lon: -80 },
  PACS2: { lat: -30, lon: -85 },
  PACS3: { lat: -10, lon: -100 },
  PAC4: { lat: 8, lon: -130 },
} as const satisfies Record<string, LatLon>

export type SeaNode = keyof typeof SEA_NODES

/**
 * Trechos estreitos demais para o mapa-múndi simplificado (canais, estreitos e
 * a chegada nos portos e rios). No mapa de 1:110m eles parecem terra.
 */
export const NARROW_EDGES: readonly (readonly [SeaNode, SeaNode])[] = [
  ['SUEZN', 'SUEZS'], ['SUEZS', 'RED1'], ['MAL', 'SING'], ['ORES', 'BALT'], ['TOKOFF', 'TOK'], ['COOK', 'ANC'],
  ['NUUKOFF', 'NUUK'], ['CHAN', 'LEHAVRE'], ['DOVER', 'THAMES'], ['FINL', 'SPB'], ['CAPEOFF', 'CABO'],
  ['GIB', 'ALB'], ['SING', 'SCS1'], ['CHAN', 'DOVER'], ['HAWN', 'HAW'],
]

export const SEA_EDGES: readonly (readonly [SeaNode, SeaNode])[] = [
  ['GAB', 'GG'], ['GG', 'LAG'], ['GG', 'WAF'], ['WAF', 'SLEONE'], ['SLEONE', 'DAK'], ['DAK', 'CAN'], ['CAN', 'MAR'], ['CAN', 'GIBW'],
  ['POR', 'SVINC'], ['SVINC', 'GIBW'], ['GIBW', 'GIB'], ['GIB', 'ALB'], ['ALB', 'MURC'], ['MURC', 'VAL'], ['ALB', 'MEDW'],
  ['MEDW', 'SARD'], ['SARD', 'TYR'], ['TYR', 'ROM'], ['SARD', 'SICS'], ['SICS', 'TRIP'], ['SICS', 'ION'],
  ['ION', 'MATA'], ['MATA', 'MYRT'], ['MYRT', 'PIR'], ['MATA', 'KYTH'], ['KYTH', 'CRETS'], ['CRETS', 'MEDE'], ['MEDE', 'NILE'],
  ['NILE', 'SUEZN'], ['SUEZN', 'SUEZS'], ['SUEZS', 'RED1'], ['RED1', 'RED2'], ['RED2', 'RED3'], ['RED3', 'BAB'], ['BAB', 'ADEN'],
  ['ADEN', 'GADE'], ['GADE', 'ARAB'], ['GADE', 'GUARD'], ['GUARD', 'SOMALI'], ['SOMALI', 'MOMB'],
  ['MOMB', 'ZAN'], ['ZAN', 'MADA'], ['ARAB', 'ARAB2'], ['ARAB2', 'RASH'], ['RASH', 'OMANG'], ['OMANG', 'HORMUZ'],
  ['HORMUZ', 'GULF'], ['GULF', 'DUB'], ['ARAB', 'INDC'], ['GUARD', 'INDC'], ['INDC', 'SRI'], ['SRI', 'BENG'], ['BENG', 'GANGES'],
  ['SRI', 'ACEH'], ['ACEH', 'MALN'], ['MALN', 'MAL'], ['MAL', 'SING'], ['SING', 'SCS1'], ['SCS1', 'SCS2'],
  ['SCS2', 'SCS3'], ['SCS3', 'TWS'], ['TWS', 'ECS'], ['ECS', 'YEL'], ['YEL', 'SHAN'], ['SHAN', 'BOH'], ['BOH', 'TIAN'], ['YEL', 'INCH'],
  ['ECS', 'KYU'], ['KYU', 'JPS'], ['JPS', 'TOKOFF'], ['TOKOFF', 'TOK'], ['TOKOFF', 'NP1'], ['NP1', 'NP2'],
  ['NP2', 'NP3'], ['NP3', 'GOA'], ['GOA', 'COOK'], ['COOK', 'ANC'], ['NP2', 'HAWN'], ['HAWN', 'HAW'],
  ['HAW', 'CALP'], ['CALP', 'LAOFF'], ['NP3', 'CALN'], ['CALN', 'LAOFF'], ['LAOFF', 'LA'],
  ['GAB', 'SATL1'], ['SATL1', 'SATL2'], ['SATL2', 'CAPEOFF'], ['CAPEOFF', 'CABO'], ['CAPEOFF', 'AGU'],
  ['AGU', 'INDS'], ['INDS', 'INDSE'], ['INDSE', 'AUSW'], ['AUSW', 'AUSS'], ['AUSS', 'BASSW'], ['BASSW', 'BASSE'],
  ['BASSE', 'TASM'], ['TASM', 'SYD'], ['DAK', 'MATL'], ['MATL', 'BERM'], ['BERM', 'NYOFF'], ['NYOFF', 'NY'], ['MATL', 'MART'],
  ['MART', 'CAR'], ['CAR', 'YUC'], ['YUC', 'GOM'], ['GOM', 'VER'], ['MATL', 'NATL'], ['NATL', 'FAREW'],
  ['FAREW', 'GRSW'], ['GRSW', 'NUUKOFF'], ['NUUKOFF', 'NUUK'], ['NATL', 'BISC'], ['POR', 'FIN'], ['FIN', 'BISC'], ['BISC', 'BREST'],
  ['BREST', 'CHAN'], ['CHAN', 'LEHAVRE'], ['CHAN', 'DOVER'], ['DOVER', 'THAMES'], ['DOVER', 'NSEA'],
  ['NSEA', 'ELBE'], ['NSEA', 'JUTW'], ['JUTW', 'SKAG'], ['SKAG', 'KAT'], ['KAT', 'ORES'], ['ORES', 'BALT'], ['BALT', 'GOTL'],
  ['GOTL', 'FINL'], ['FINL', 'SPB'], ['NSEA', 'NORW'], ['NORW', 'NOR2'], ['NOR2', 'SVAL'], ['SVAL', 'POLE'],
  ['SATL2', 'SAT3'], ['SAT3', 'ANT'],
  ['PATOFF', 'SATS'], ['PATOFF', 'ARG2'], ['SATS', 'MALVOFF'], ['SATS', 'DRAKE'], ['MALVOFF', 'DRAKE'], ['MALVOFF', 'ARG2'],
  ['DRAKE', 'HORN'], ['DRAKE', 'ANT'], ['ARG2', 'URU'], ['URU', 'RSOFF'], ['URU', 'SAT3'], ['RSOFF', 'SCOFF'], ['SCOFF', 'PROFF'],
  ['PROFF', 'RJOFF'], ['RJOFF', 'CFRIO'], ['CFRIO', 'ESOFF'], ['ESOFF', 'ABROL'], ['ABROL', 'SSAOFF'], ['SSAOFF', 'MACOFF'],
  ['MACOFF', 'PECOFF'], ['PECOFF', 'NATOFF'], ['NATOFF', 'EQ'], ['NATOFF', 'DAK'], ['EQ', 'MIDATL'], ['EQ', 'MART'], ['EQ', 'MATL'],
  ['MIDATL', 'WAF'], ['MIDATL', 'GG'], ['MIDATL', 'GAB'], ['ABROL', 'SATL2'],
  ['HORN', 'PACS0'], ['PACS0', 'PACS1'], ['PACS1', 'PACS2'], ['PACS2', 'PACS3'], ['PACS3', 'LAOFF'], ['PACS3', 'PAC4'],
  ['PAC4', 'HAWN'], ['PAC4', 'CALP'],
]

/** Porto (ponto no mar ou na foz do rio) mais perto de cada destino. */
export const DESTINATION_PORTS: Readonly<Record<string, SeaNode>> = {
  lagos: 'LAG',
  saara: 'TRIP',
  nairobi: 'MOMB',
  cabo: 'CABO',
  marrakech: 'MAR',
  cairo: 'NILE',
  madagascar: 'MADA',
  madri: 'VAL',
  roma: 'ROM',
  atenas: 'PIR',
  paris: 'LEHAVRE',
  londres: 'THAMES',
  berlim: 'ELBE',
  dubai: 'DUB',
  moscou: 'SPB',
  'nova-york': 'NY',
  everest: 'GANGES',
  groenlandia: 'NUUK',
  'polo-norte': 'POLE',
  mexico: 'VER',
  singapura: 'SING',
  pequim: 'TIAN',
  'polo-sul': 'ANT',
  'los-angeles': 'LA',
  seul: 'INCH',
  toquio: 'TOK',
  alasca: 'ANC',
  sydney: 'SYD',
  havai: 'HAW',
}

/** Porto de cada lugar do caminho e das Malvinas (pontos no mar ao largo da costa). */
export const STOP_PORTS: Readonly<Record<string, SeaNode>> = {
  patagonia: 'PATOFF',
  malvinas: 'MALVOFF',
  'santa-catarina': 'SCOFF',
  'caminho-22': 'PROFF',
  'caminho-30': 'RJOFF',
  'caminho-40': 'SSAOFF',
  'caminho-46': 'NATOFF',
  'caminho-52': 'EQ',
  'caminho-58': 'MIDATL',
  'caminho-79': 'GAB',
  ...DESTINATION_PORTS,
}

type Graph = Map<SeaNode, { to: SeaNode; km: number }[]>

function buildGraph(): Graph {
  const graph: Graph = new Map()
  for (const [a, b] of SEA_EDGES) {
    const km = greatCircleKm(SEA_NODES[a], SEA_NODES[b])
    graph.set(a, [...(graph.get(a) ?? []), { to: b, km }])
    graph.set(b, [...(graph.get(b) ?? []), { to: a, km }])
  }
  return graph
}

const GRAPH = buildGraph()

type Shortest = { km: Map<SeaNode, number>; previous: Map<SeaNode, SeaNode> }

/** Dijkstra a partir de um ponto do mar. */
function shortestFrom(start: SeaNode): Shortest {
  const km = new Map<SeaNode, number>([[start, 0]])
  const previous = new Map<SeaNode, SeaNode>()
  const open = new Set<SeaNode>([start])
  while (open.size > 0) {
    const current = [...open].reduce((best, node) => ((km.get(node) ?? Infinity) < (km.get(best) ?? Infinity) ? node : best))
    open.delete(current)
    for (const edge of GRAPH.get(current) ?? []) {
      const candidate = (km.get(current) ?? Infinity) + edge.km
      if (candidate < (km.get(edge.to) ?? Infinity)) {
        km.set(edge.to, candidate)
        previous.set(edge.to, current)
        open.add(edge.to)
      }
    }
  }
  return { km, previous }
}

const FROM_AFRICA = shortestFrom('GAB')

/** Pontos do caminho pelo mar, da África até o porto. */
export function seaPathTo(port: SeaNode): LatLon[] {
  const nodes: SeaNode[] = [port]
  let current: SeaNode = port
  while (current !== 'GAB') {
    const previous = FROM_AFRICA.previous.get(current)
    if (!previous) {
      throw new Error(`Porto sem caminho pelo mar: ${port}`)
    }
    nodes.unshift(previous)
    current = previous
  }
  return nodes.map((node) => SEA_NODES[node])
}

export type SeaRoute = {
  /** Pontos do caminho: África → … → porto → destino. */
  points: LatLon[]
  /** Distância nadando pelo mar até o porto. */
  seaKm: number
  /** Último trechinho do porto até o lugar (rio, gelo ou chão). */
  finalKm: number
}

const SHORTEST = new Map<SeaNode, Shortest>()

function shortestCached(start: SeaNode): Shortest {
  const cached = SHORTEST.get(start)
  if (cached) {
    return cached
  }
  const computed = shortestFrom(start)
  SHORTEST.set(start, computed)
  return computed
}

/** Pontos do mar entre dois portos, pelo caminho mais curto da rede. */
export function seaPathBetween(from: SeaNode, to: SeaNode): LatLon[] {
  const { previous } = shortestCached(from)
  const nodes: SeaNode[] = [to]
  let current: SeaNode = to
  while (current !== from) {
    const before = previous.get(current)
    if (!before) {
      throw new Error(`Sem caminho pelo mar entre ${from} e ${to}`)
    }
    nodes.unshift(before)
    current = before
  }
  return nodes.map((node) => SEA_NODES[node])
}

export function seaRoute(destinationId: string, at: LatLon): SeaRoute {
  const port = DESTINATION_PORTS[destinationId]
  if (!port) {
    throw new Error(`Destino sem porto: ${destinationId}`)
  }
  const seaKm = FROM_AFRICA.km.get(port) ?? Infinity
  return { points: [...seaPathTo(port), at], seaKm, finalKm: greatCircleKm(SEA_NODES[port], at) }
}
