import { GOAL_HOPS, KM_PER_CELL, WAYPOINTS } from './config'
import { SPACE_BODIES } from './destinations'
import { REACHED_DESTINATIONS } from './interpreter'
import { ANSWER_KM, gridToLatLon, PATH } from './route'
import type { LatLon, PenguinMood } from './types'

/** Um lugar para visitar no modo Explorar. */
export type ExplorePlace = {
  id: string
  name: string
  region: string
  line: string
  /** Distância desde a Patagônia, seguindo o caminho do jogo. */
  km: number
  mood: PenguinMood
  /** Cena própria do selo (PLACE_SCENES), quando existe. */
  sceneId?: string
  /** Onde fica na Terra; lugares do espaço não têm. */
  at?: LatLon
  group: 'caminho' | 'mundo' | 'espaco'
}

const START: ExplorePlace = {
  id: 'patagonia',
  name: 'Patagônia',
  region: 'Argentina',
  line: 'A casa do Pingo. Daqui começam todas as viagens.',
  km: 0,
  mood: 'normal',
  at: gridToLatLon(PATH[0]),
  group: 'caminho',
}

const GOAL: ExplorePlace = {
  id: 'santa-catarina',
  name: 'Santa Catarina',
  region: 'Brasil',
  line: 'O destino da missão: 21 quadradinhos desde a Patagônia.',
  km: ANSWER_KM,
  mood: 'feliz',
  sceneId: 'santa-catarina',
  at: gridToLatLon(PATH[GOAL_HOPS]),
  group: 'caminho',
}

const ALONG_THE_WAY: ExplorePlace[] = WAYPOINTS
  .filter((waypoint) => waypoint.hops !== GOAL_HOPS && waypoint.line)
  .map((waypoint) => ({
    id: `caminho-${waypoint.hops}`,
    name: waypoint.place,
    region: 'No caminho do Pingo',
    line: waypoint.line ?? '',
    km: waypoint.hops * KM_PER_CELL,
    mood: waypoint.mood ?? 'normal',
    sceneId: waypoint.sceneId,
    at: gridToLatLon(PATH[waypoint.hops]),
    group: 'caminho' as const,
  }))

const WORLD: ExplorePlace[] = REACHED_DESTINATIONS.map((destination) => ({
  id: destination.id,
  name: destination.name,
  region: destination.region,
  line: destination.line,
  km: destination.km,
  mood: destination.mood,
  sceneId: destination.id,
  at: destination.at,
  group: 'mundo' as const,
}))

export const EARTH_PLACES: readonly ExplorePlace[] = [START, GOAL, ...ALONG_THE_WAY, ...WORLD]

export const SPACE_PLACES: readonly ExplorePlace[] = SPACE_BODIES.map((body) => ({
  id: body.id,
  name: body.name,
  region: 'Espaço',
  line: body.line,
  km: body.km,
  mood: 'astronauta' as const,
  sceneId: body.id,
  group: 'espaco' as const,
}))
