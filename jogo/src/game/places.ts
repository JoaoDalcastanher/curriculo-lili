import { GOAL_HOPS, KM_PER_CELL, WAYPOINTS } from './config'
import { SPACE_BODIES } from './destinations'
import { STOPS } from './stops'
import { squaresBetween } from './trip'
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

/** Distância desde a Patagônia: a mesma resposta do jogo (quadradinhos × 150 km). */
const fromPatagonia = (id: string) => squaresBetween('patagonia', id) * KM_PER_CELL

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
    km: fromPatagonia(`caminho-${waypoint.hops}`),
    mood: waypoint.mood ?? 'normal',
    sceneId: waypoint.sceneId,
    at: gridToLatLon(PATH[waypoint.hops]),
    group: 'caminho' as const,
  }))

const WORLD: ExplorePlace[] = STOPS
  .filter((stop) => stop.group === 'mundo')
  .map((stop) => ({
    id: stop.id,
    name: stop.name,
    region: stop.region,
    line: stop.line,
    km: fromPatagonia(stop.id),
    mood: stop.mood,
    sceneId: stop.sceneId,
    at: stop.at,
    group: 'mundo' as const,
  }))
  .sort((a, b) => a.km - b.km)

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
