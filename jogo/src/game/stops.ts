import { WAYPOINTS } from './config'
import { DESTINATIONS } from './destinations'
import type { LatLon, Stop } from './types'

/**
 * Onde fica de verdade cada parada do caminho (o mapa da atividade é
 * esquemático; para nadar pelo mar entre quaisquer lugares usamos o lugar real).
 */
const REAL_PLACE: Readonly<Record<number, LatLon>> = {
  22: { lat: -25.55, lon: -48.3 },
  30: { lat: -22.95, lon: -43.2 },
  40: { lat: -12.97, lon: -38.5 },
  46: { lat: -5.8, lon: -35.2 },
  52: { lat: 0, lon: -32 },
  58: { lat: 2, lon: -20 },
  79: { lat: 0.4, lon: 9.45 },
}

const PATAGONIA: Stop = {
  id: 'patagonia',
  name: 'Patagônia',
  region: 'Argentina',
  at: { lat: -42.77, lon: -65.04 },
  line: 'A casa do Pingo. Daqui começam todas as viagens.',
  mood: 'normal',
  group: 'caminho',
}

const SANTA_CATARINA: Stop = {
  id: 'santa-catarina',
  name: 'Santa Catarina',
  region: 'Brasil',
  at: { lat: -27.6, lon: -48.55 },
  line: 'A Ponte Hercílio Luz, em Florianópolis, toda iluminada.',
  mood: 'feliz',
  sceneId: 'santa-catarina',
  group: 'caminho',
}

/** As Ilhas Malvinas, onde mora a Pinga. */
export const MALVINAS: Stop = {
  id: 'malvinas',
  name: 'Ilhas Malvinas',
  region: 'Atlântico Sul',
  at: { lat: -51.7, lon: -57.85 },
  line: 'Levou o maior peixe do mar até a toca da Pinga. Ela aceitou. Agora ele já sabe para onde voltar todo ano.',
  mood: 'feliz',
  sceneId: 'malvinas',
  group: 'mundo',
}

const ALONG_THE_WAY: Stop[] = WAYPOINTS.filter((waypoint) => REAL_PLACE[waypoint.hops] !== undefined).map((waypoint) => ({
  id: `caminho-${waypoint.hops}`,
  name: waypoint.hops === 79 ? 'Gabão' : waypoint.place,
  region: waypoint.hops === 79 ? 'África' : waypoint.hops >= 52 ? 'Oceano Atlântico' : 'Brasil',
  at: REAL_PLACE[waypoint.hops],
  line: waypoint.line ?? '',
  mood: waypoint.mood ?? 'normal',
  sceneId: waypoint.sceneId,
  group: 'caminho',
}))

const WORLD: Stop[] = DESTINATIONS.map((destination) => ({ ...destination, sceneId: destination.id, group: 'mundo' }))

/** Todos os lugares da Terra que podem ser saída ou chegada. */
export const STOPS: readonly Stop[] = [PATAGONIA, SANTA_CATARINA, ...ALONG_THE_WAY, MALVINAS, ...WORLD]

export const DEFAULT_FROM = PATAGONIA.id
export const DEFAULT_TO = SANTA_CATARINA.id

export function stopById(id: string): Stop {
  const stop = STOPS.find((item) => item.id === id)
  if (!stop) {
    throw new Error(`Lugar desconhecido: ${id}`)
  }
  return stop
}
