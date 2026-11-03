import { GOAL_HOPS, KM_PER_CELL } from './config'
import { greatCircleKm } from './geo'
import { PATH } from './route'
import { seaPathBetween, STOP_PORTS, type SeaNode } from './sea'
import { stopById, STOPS } from './stops'
import type { GridPoint, LatLon, Stop } from './types'

/**
 * Uma viagem entre dois lugares quaisquer da Terra, sempre na escala da
 * atividade: 1 quadradinho = 150 km, andando só na horizontal ou na vertical.
 *
 * O caminho segue a rede de rotas pelo mar (sea.ts) e é "desenhado" no
 * quadriculado em degraus, quadradinho por quadradinho. A resposta certa é
 * o número de degraus × 150 km. Patagônia ↔ Santa Catarina usa o percurso
 * original da atividade (21 quadradinhos).
 */

/** Quadradinhos por grau de latitude. */
export const CELLS_PER_DEGREE = 111.32 / KM_PER_CELL

/** Como o pedaço do planeta vira o quadriculado desta viagem. */
export type GridFrame = {
  lat0: number
  lon0: number
  /** Encolhimento das longitudes na latitude do meio da viagem. */
  cos0: number
}

export type Trip = {
  from: Stop
  to: Stop
  /** 'ida'/'volta' quando é o percurso original da atividade. */
  classic: 'ida' | 'volta' | null
  squares: number
  answerKm: number
  /** Centros dos quadradinhos do caminho, do início ao fim. */
  cells: readonly GridPoint[]
  /** Caminho pelo mar (para o globo). */
  route: readonly LatLon[]
  /** Quadriculado da viagem (null no percurso original, que tem mapa próprio). */
  frame: GridFrame | null
}

function portOf(stop: Stop): SeaNode {
  const port = STOP_PORTS[stop.id]
  if (!port) {
    throw new Error(`Lugar sem porto: ${stop.id}`)
  }
  return port
}

/** Do lugar ao porto, pelo mar até o outro porto, e do porto ao lugar. */
export function seaRouteBetween(from: Stop, to: Stop): LatLon[] {
  return [from.at, ...seaPathBetween(portOf(from), portOf(to)), to.at]
}

/** Longitudes contínuas (sem pular de +180 para -180 no meio do caminho). */
function unwrap(points: readonly LatLon[]): LatLon[] {
  const result: LatLon[] = []
  for (const point of points) {
    const previous = result.at(-1)
    const lon = previous ? previous.lon + ((((point.lon - previous.lon) % 360) + 540) % 360) - 180 : point.lon
    result.push({ lat: point.lat, lon })
  }
  return result
}

export function frameFor(points: readonly LatLon[]): GridFrame {
  const unwrapped = unwrap(points)
  const lats = unwrapped.map((point) => point.lat)
  const lons = unwrapped.map((point) => point.lon)
  const lat0 = (Math.min(...lats) + Math.max(...lats)) / 2
  const lon0 = (Math.min(...lons) + Math.max(...lons)) / 2
  return { lat0, lon0, cos0: Math.max(0.2, Math.cos((lat0 * Math.PI) / 180)) }
}

/** Latitude/longitude → coordenadas do quadriculado (x → leste, y ↑ norte). */
export function toGrid(point: LatLon, frame: GridFrame): GridPoint {
  const dLon = ((((point.lon - frame.lon0) % 360) + 540) % 360) - 180
  return { x: dLon * frame.cos0 * CELLS_PER_DEGREE, y: (point.lat - frame.lat0) * CELLS_PER_DEGREE }
}

const cellOf = (point: GridPoint): GridPoint => ({ x: Math.floor(point.x), y: Math.floor(point.y) })

function distanceToLine(point: GridPoint, a: GridPoint, b: GridPoint): number {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const length = Math.hypot(dx, dy)
  if (length === 0) {
    return Math.hypot(point.x - a.x, point.y - a.y)
  }
  return Math.abs(dy * (point.x - a.x) - dx * (point.y - a.y)) / length
}

/**
 * Transforma o caminho em degraus de 1 quadradinho (só horizontal/vertical),
 * escolhendo sempre o degrau que fica mais perto da linha do caminho.
 */
export function staircase(points: readonly GridPoint[]): GridPoint[] {
  const first = points[0]
  if (!first) {
    return []
  }
  let current = cellOf(first)
  const cells: GridPoint[] = [current]
  points.slice(1).forEach((target, index) => {
    const segmentStart = points[index]
    const goal = cellOf(target)
    while (current.x !== goal.x || current.y !== goal.y) {
      const options: GridPoint[] = []
      if (current.x !== goal.x) {
        options.push({ x: current.x + Math.sign(goal.x - current.x), y: current.y })
      }
      if (current.y !== goal.y) {
        options.push({ x: current.x, y: current.y + Math.sign(goal.y - current.y) })
      }
      const center = (cell: GridPoint) => ({ x: cell.x + 0.5, y: cell.y + 0.5 })
      current = options.reduce((best, option) => (
        distanceToLine(center(option), segmentStart, target) < distanceToLine(center(best), segmentStart, target) ? option : best
      ))
      cells.push(current)
    }
  })
  return withoutLoops(cells).map((cell) => ({ x: cell.x + 0.5, y: cell.y + 0.5 }))
}

/** Se o caminho volta por um quadradinho onde já passou, corta a ida e volta. */
function withoutLoops(cells: readonly GridPoint[]): GridPoint[] {
  const result: GridPoint[] = []
  const seen = new Map<string, number>()
  for (const cell of cells) {
    const key = `${cell.x},${cell.y}`
    const before = seen.get(key)
    if (before !== undefined) {
      result.splice(before + 1).forEach((dropped) => seen.delete(`${dropped.x},${dropped.y}`))
      continue
    }
    seen.set(key, result.length)
    result.push(cell)
  }
  return result
}

const CLASSIC_FROM = 'patagonia'
const CLASSIC_TO = 'santa-catarina'

function classicOf(from: Stop, to: Stop): Trip['classic'] {
  if (from.id === CLASSIC_FROM && to.id === CLASSIC_TO) {
    return 'ida'
  }
  return from.id === CLASSIC_TO && to.id === CLASSIC_FROM ? 'volta' : null
}

type Grid = { cells: GridPoint[]; frame: GridFrame | null }

const GRIDS = new Map<string, Grid>()

/** Degraus entre dois lugares; o mesmo caminho nos dois sentidos. */
function gridBetween(from: Stop, to: Stop): Grid {
  const key = [from.id, to.id].sort().join('→')
  const cached = GRIDS.get(key)
  const forward = from.id <= to.id
  if (cached) {
    return forward ? cached : { ...cached, cells: [...cached.cells].reverse() }
  }
  const [a, b] = forward ? [from, to] : [to, from]
  const classic = classicOf(a, b)
  const grid: Grid = classic
    ? { cells: PATH.slice(0, GOAL_HOPS + 1).map((point) => ({ ...point })), frame: null }
    : (() => {
        const route = seaRouteBetween(a, b)
        const frame = frameFor(route)
        const cells = staircase(route.map((point) => toGrid(point, frame)))
        // Dois lugares nunca ficam no mesmo quadradinho: pelo menos 1 passo.
        const steps = cells.length > 1 ? cells : [...cells, { x: cells[0].x + 1, y: cells[0].y }]
        return { cells: steps, frame }
      })()
  const canonical = classic === 'volta' ? { ...grid, cells: [...grid.cells].reverse() } : grid
  GRIDS.set(key, canonical)
  return forward ? canonical : { ...canonical, cells: [...canonical.cells].reverse() }
}

export function squaresBetween(fromId: string, toId: string): number {
  return gridBetween(stopById(fromId), stopById(toId)).cells.length - 1
}

export function buildTrip(fromId: string, toId: string): Trip {
  const from = stopById(fromId)
  const to = stopById(toId)
  if (from.id === to.id) {
    throw new Error('A saída e a chegada precisam ser lugares diferentes')
  }
  const { cells, frame } = gridBetween(from, to)
  const squares = cells.length - 1
  return {
    from,
    to,
    classic: classicOf(from, to),
    squares,
    answerKm: squares * KM_PER_CELL,
    cells,
    route: seaRouteBetween(from, to),
    frame,
  }
}

export type Onward = { stop: Stop; km: number; squares: number }

/**
 * Se o Pingo passar da chegada e continuar nadando: a que distância (desde a
 * saída) fica cada outro lugar do planeta, em ordem. "Proporcional" de verdade:
 * chegada + o caminho da chegada até lá, tudo em quadradinhos de 150 km.
 */
export function onwardFrom(trip: Trip): Onward[] {
  return STOPS
    .filter((stop) => stop.id !== trip.from.id && stop.id !== trip.to.id)
    .map((stop) => {
      const squares = trip.squares + squaresBetween(trip.to.id, stop.id)
      return { stop, squares, km: squares * KM_PER_CELL }
    })
    .sort((a, b) => a.km - b.km)
}

/** Distância real (não em degraus) de um caminho, para a animação no globo. */
export function routeKm(route: readonly LatLon[]): number {
  return route.slice(1).reduce((sum, point, index) => sum + greatCircleKm(route[index], point), 0)
}
