import { COLUMN_LABELS, GOAL_HOPS, GRID_SIZE, PLACES, SOUTH_AMERICA, WAYPOINTS } from '../game/config'
import { GOAL, PATH, positionAtHops, trailAtHops } from '../game/route'
import type { GridPoint, PenguinMood } from '../game/types'
import { Penguin } from './Penguin'

/** Unidades SVG por quadradinho. */
const CELL = 60
const MARGIN = 46

type MapBoardProps = {
  /** Passos já percorridos na malha. */
  hops: number
  traveling: boolean
  mood: PenguinMood
  celebrating: boolean
  /** Esconde os balões quando outra cena está por cima do mapa. */
  hidden: boolean
}

type Window = { x: number; y: number; width: number }

/**
 * O mapa é sempre o quadriculado da atividade (15 × 15). Se o Pingo passar de
 * Santa Catarina, a viagem acontece no globo — o mapa não se expande.
 */
const VIEW: Window = { x: -MARGIN, y: -GRID_SIZE * CELL - MARGIN, width: GRID_SIZE * CELL + MARGIN * 2 }

function toSvg(point: GridPoint): GridPoint {
  return { x: point.x * CELL, y: -point.y * CELL }
}

function toPercent(point: GridPoint, view: Window): { left: string; top: string } {
  const svg = toSvg(point)
  return {
    left: `${((svg.x - view.x) / view.width) * 100}%`,
    top: `${((svg.y - view.y) / view.width) * 100}%`,
  }
}

function polyline(points: readonly GridPoint[]): string {
  return points.map((point) => `${(point.x * CELL).toFixed(1)},${(-point.y * CELL).toFixed(1)}`).join(' ')
}

const polygon = (points: readonly GridPoint[]) => `M${polyline(points).replace(/ /g, ' L')} Z`
const SOUTH_AMERICA_PATH = polygon(SOUTH_AMERICA)
const BASE_ROUTE = PATH.slice(0, GOAL_HOPS + 1)
const STOPS = WAYPOINTS.filter((waypoint) => waypoint.hops < GOAL_HOPS)
const BASE = GRID_SIZE * CELL
const lines = Array.from({ length: GRID_SIZE + 1 }, (_, index) => index)
const indexes = Array.from({ length: GRID_SIZE }, (_, index) => index)
const STAR_PATH = 'M0 -17 L5 -5.5 L17.5 -5.2 L7.8 2.8 L11 15 L0 8 L-11 15 L-7.8 2.8 L-17.5 -5.2 L-5 -5.5 Z'
const NON_SCALING = { vectorEffect: 'non-scaling-stroke' } as const

const WAVES: readonly GridPoint[] = [
  { x: 10.2, y: 7.2 },
  { x: 12.6, y: 9.4 },
  { x: 8.6, y: 3.2 },
  { x: 13.2, y: 4.1 },
  { x: 5.6, y: 1.6 },
  { x: 13.6, y: 12.2 },
]

function MapLabel({ at, children, className, anchor = 'middle', size }: {
  at: GridPoint
  children: string
  className: string
  anchor?: 'start' | 'middle' | 'end'
  size?: number
}) {
  const svg = toSvg(at)
  return (
    <text x={svg.x} y={svg.y} className={className} textAnchor={anchor} style={size ? { fontSize: size } : undefined}>
      {children}
    </text>
  )
}

function CityDot({ at, radius = 6 }: { at: GridPoint; radius?: number }) {
  const svg = toSvg(at)
  return <circle cx={svg.x} cy={svg.y} r={radius} className="map-city" style={NON_SCALING} />
}

export function MapBoard({ hops, traveling, mood, celebrating, hidden }: MapBoardProps) {
  const position = positionAtHops(hops)
  const trail = trailAtHops(hops)
  const view = VIEW
  const bubbleLeft = position.x > 9
  const bubbleBelow = position.y > GRID_SIZE - 2
  const goal = toSvg(GOAL)
  const marginPercent = (MARGIN / view.width) * 100

  return (
    <div className="map" data-testid="mapa">
      <svg
        viewBox={`${view.x} ${view.y} ${view.width} ${view.width}`}
        className="map-svg"
        role="img"
        aria-label="Mapa quadriculado da Patagônia até Santa Catarina"
      >
        <defs>
          <clipPath id="board">
            <rect x="0" y={-BASE} width={BASE} height={BASE} rx={14} />
          </clipPath>
          <pattern id="sea-texture" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="1" className="sea-dot" />
          </pattern>
        </defs>

        <g clipPath="url(#board)">
          <rect x="0" y={-BASE} width={BASE} height={BASE} className="map-sea" />
          <rect x="0" y={-BASE} width={BASE} height={BASE} fill="url(#sea-texture)" />
          <path d={SOUTH_AMERICA_PATH} className="map-land" style={NON_SCALING} />

          {WAVES.map((wave) => {
            const svg = toSvg(wave)
            return <path key={`${wave.x}-${wave.y}`} d={`M${svg.x} ${svg.y} q7 -7 14 0 t14 0`} className="map-wave" />
          })}

          {lines.map((index) => (
            <g key={index} className="map-grid">
              <line x1={index * CELL} y1={0} x2={index * CELL} y2={-BASE} style={NON_SCALING} />
              <line x1={0} y1={-index * CELL} x2={BASE} y2={-index * CELL} style={NON_SCALING} />
            </g>
          ))}

          <polyline points={polyline(BASE_ROUTE)} className="map-route" style={NON_SCALING} />
          <polyline points={polyline(trail)} className="map-trail" data-testid="rastro" style={NON_SCALING} />

          {STOPS.map((stop) => {
            const center = toSvg(PATH[stop.hops])
            return <path key={stop.hops} transform={`translate(${center.x} ${center.y}) scale(0.55)`} d={STAR_PATH} className="map-stop" />
          })}

          <MapLabel at={{ x: 3.1, y: 11.4 }} className="map-country">ARGENTINA</MapLabel>
          <MapLabel at={{ x: 8.9, y: 14.15 }} className="map-country">BRASIL</MapLabel>
          <MapLabel at={{ x: 10.4, y: 4.6 }} className="map-ocean">Oceano Atlântico</MapLabel>
          <MapLabel at={{ x: 4, y: 2.15 }} className="map-region">Patagônia</MapLabel>
          <MapLabel at={{ x: 12.15, y: 14.36 }} className="map-region is-small" anchor="start">Santa Catarina</MapLabel>
          <CityDot at={PLACES.buenosAires} />
          <MapLabel at={{ x: 6.15, y: 9.42 }} className="map-city-label" anchor="end">Buenos Aires</MapLabel>
          <CityDot at={PLACES.montevideu} />
          <MapLabel at={{ x: 7.05, y: 9.3 }} className="map-city-label" anchor="start">Montevidéu</MapLabel>

          <g className={celebrating ? 'map-goal is-celebrating' : 'map-goal'} transform={`translate(${goal.x} ${goal.y})`}>
            <circle r="24" className="map-goal-halo" />
            <path d={STAR_PATH} className="map-goal-star" />
          </g>
        </g>

        <rect x="0" y={-BASE} width={BASE} height={BASE} rx="14" className="map-frame" style={NON_SCALING} />
        <g>
          {indexes.map((index) => {
            const center = index * CELL + CELL / 2
            const row = GRID_SIZE - index
            return (
              <g key={index} className="map-axis">
                <text x={center} y={-BASE - 16}>{COLUMN_LABELS[index]}</text>
                <text x={center} y={30}>{COLUMN_LABELS[index]}</text>
                <text x={-22} y={-BASE + center + 6}>{row}</text>
                <text x={BASE + 22} y={-BASE + center + 6}>{row}</text>
              </g>
            )
          })}
        </g>
      </svg>

      <div
        className="map-legend"
        data-testid="legenda"
        style={{ left: `calc(${marginPercent}% + 12px)`, bottom: `calc(${marginPercent}% + 12px)` }}
      >
        <span>1 quadradinho = 150 km</span>
        <span className="map-legend-bar" style={{ width: `${(CELL / view.width) * 100}cqw` }} />
      </div>

      <div
        className={traveling ? 'map-penguin is-traveling' : 'map-penguin'}
        style={toPercent(position, view)}
        data-testid="pinguim"
        data-hops={position.hops.toFixed(2)}
      >
        <Penguin mood={traveling ? 'normal' : mood} className="map-penguin-svg" />
      </div>

      {position.greeting && !hidden && (
        <div
          key={position.greeting}
          className={['map-bubble', bubbleLeft ? 'is-left' : '', bubbleBelow ? 'is-below' : ''].join(' ').trim()}
          style={toPercent(position, view)}
          data-testid="balao"
        >
          {position.greeting}
        </div>
      )}
    </div>
  )
}
