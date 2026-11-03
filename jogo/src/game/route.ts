import { COLUMN_LABELS, GOAL_HOPS, GRID_SIZE, KM_PER_CELL, PROJECTION, ROUTE_MOVES, START, WAYPOINTS } from './config'
import type { GridPoint, LatLon, TravelPosition } from './types'

const STEP: Record<string, GridPoint> = {
  R: { x: 1, y: 0 },
  U: { x: 0, y: 1 },
}

function buildPath(): GridPoint[] {
  const points: GridPoint[] = [START]
  for (const move of ROUTE_MOVES) {
    const step = STEP[move]
    if (!step) {
      throw new Error(`Passo inválido no percurso: ${move}`)
    }
    const last = points[points.length - 1]
    points.push({ x: last.x + step.x, y: last.y + step.y })
  }
  return points
}

/** Centros dos quadradinhos por onde o Pingo passa, em ordem. */
export const PATH: readonly GridPoint[] = buildPath()

/** Último passo desenhado no mapa (chegada na África). */
export const PATH_END_HOPS = PATH.length - 1

/** A resposta certa: quadradinhos até Santa Catarina × escala. */
export const ANSWER_KM = GOAL_HOPS * KM_PER_CELL

export const PATH_END_KM = PATH_END_HOPS * KM_PER_CELL

export const GOAL = PATH[GOAL_HOPS]

export function kmToSquares(km: number): number {
  return km / KM_PER_CELL
}

/** Nome do quadradinho ("F6"), ou undefined fora do mapa da atividade. */
export function cellName(point: GridPoint): string | undefined {
  const column = Math.floor(point.x)
  const row = Math.floor(point.y) + 1
  if (column < 0 || column >= GRID_SIZE || row < 1 || row > GRID_SIZE) {
    return undefined
  }
  return `${COLUMN_LABELS[column]}${row}`
}

/** Por quantos passos o balão de uma parada continua aparecendo. */
const GREETING_HOPS = 2.5

function greetingAt(hops: number): string | undefined {
  const reached = WAYPOINTS.filter((waypoint) => waypoint.hops <= hops + 0.001).at(-1)
  if (!reached) {
    return undefined
  }
  const isGoal = reached.hops === GOAL_HOPS && hops < GOAL_HOPS + 0.5
  return isGoal || hops - reached.hops <= GREETING_HOPS ? reached.greeting : undefined
}

/** Nome do trecho em que o Pingo está. */
export function placeAt(hops: number): string {
  return WAYPOINTS.filter((waypoint) => waypoint.hops <= hops + 0.001).at(-1)?.place ?? 'Patagônia'
}

/** Onde o Pingo está depois de `hops` passos na malha (limitado ao percurso desenhado). */
export function positionAtHops(rawHops: number): TravelPosition {
  const hops = Math.min(Math.max(0, rawHops), PATH_END_HOPS)
  const index = Math.min(Math.floor(hops), PATH_END_HOPS - 1)
  const fraction = hops - index
  const from = PATH[index]
  const to = PATH[index + 1]
  return {
    x: from.x + (to.x - from.x) * fraction,
    y: from.y + (to.y - from.y) * fraction,
    hops,
    greeting: greetingAt(hops),
  }
}

/** Pontos do rastro já percorrido. */
export function trailAtHops(hops: number): GridPoint[] {
  const position = positionAtHops(hops)
  return [...PATH.slice(0, Math.floor(position.hops) + 1), { x: position.x, y: position.y }]
}

/** Converte o quadriculado para latitude/longitude (aproximado, só para o globo). */
export function gridToLatLon(point: GridPoint): LatLon {
  return {
    lon: PROJECTION.originLon + (point.x - START.x) / PROJECTION.cellsPerLonDegree,
    lat: PROJECTION.originLat + (point.y - START.y) / PROJECTION.cellsPerLatDegree,
  }
}

export const PATH_END_LATLON = gridToLatLon(PATH[PATH_END_HOPS])
