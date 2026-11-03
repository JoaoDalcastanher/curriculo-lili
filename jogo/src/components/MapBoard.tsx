import { AFRICA, COLUMN_LABELS, EQUATOR_Y, GOAL_HOPS, GRID_SIZE, PLACES, SOUTH_AMERICA, WAYPOINTS } from '../game/config'
import { GOAL, PATH, positionAtHops, trailAtHops } from '../game/route'
import type { GridPoint, PenguinMood } from '../game/types'
import { Penguin } from './Penguin'

/** Unidades SVG por quadradinho. */
const CELL = 60
const MARGIN = 46
const MAX_WORLD = 60

type MapBoardProps = {
  /** Passos já percorridos na malha. */
  hops: number
  traveling: boolean
  mood: PenguinMood
  celebrating: boolean
  /** Esconde os balões quando outra cena está por cima do mapa. */
  hidden: boolean
}

type Window = { size: number; zoom: number; x: number; y: number; width: number }

const clamp01 = (value: number) => Math.max(0, Math.min(1, value))

/** O mapa cresce junto com o Pingo quando ele sai do quadriculado da atividade. */
export function windowFor(point: GridPoint): Window {
  const need = Math.max(point.x, point.y) + 0.5
  const size = Math.max(GRID_SIZE, need + 2.5 * clamp01(need - GRID_SIZE))
  const zoom = size / GRID_SIZE
  const margin = MARGIN * zoom
  return { size, zoom, x: -margin, y: -size * CELL - margin, width: size * CELL + margin * 2 }
}

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
const AFRICA_PATH = polygon(AFRICA)
const BASE_ROUTE = PATH.slice(0, GOAL_HOPS + 1)
const STOPS = WAYPOINTS.filter((waypoint) => waypoint.hops < GOAL_HOPS)
const BASE = GRID_SIZE * CELL
const lines = Array.from({ length: MAX_WORLD + 1 }, (_, index) => index)
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
  { x: 26, y: 12 },
  { x: 34, y: 26 },
  { x: 42, y: 16 },
  { x: 28, y: 40 },
  { x: 24, y: 20 },
]

type FarLabel = { at: GridPoint; text: string; className: string; anchor?: 'start' | 'middle' | 'end'; size: number }

/** Rótulos que só aparecem quando o mapa se expande. */
const FAR_LABELS: readonly FarLabel[] = [
  { at: { x: 9, y: 25 }, text: 'BRASIL', className: 'map-country', size: 30 },
  { at: { x: 45, y: 46 }, text: 'ÁFRICA', className: 'map-country', size: 30 },
  { at: { x: 34, y: 20 }, text: 'Oceano Atlântico', className: 'map-ocean', size: 26 },
  { at: { x: 16.1, y: 17.9 }, text: 'Rio de Janeiro', className: 'map-city-label', anchor: 'end', size: 17 },
  { at: { x: 19, y: 25 }, text: 'Salvador', className: 'map-city-label', anchor: 'end', size: 17 },
  { at: { x: 21, y: 30.4 }, text: 'Natal', className: 'map-city-label', anchor: 'end', size: 17 },
  { at: { x: 50.2, y: 36 }, text: 'Gabão', className: 'map-city-label', anchor: 'middle', size: 17 },
  { at: { x: 36, y: 34.6 }, text: 'Linha do Equador', className: 'map-equator-label', size: 17 },
]

const FAR_DOTS: readonly GridPoint[] = [
  { x: 16.5, y: 17.4 },
  { x: 19.5, y: 24.6 },
  { x: 21.5, y: 29.9 },
  { x: 50.2, y: 34.6 },
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
  const view = windowFor(position)
  const expanded = clamp01((view.size - GRID_SIZE - 1) / 3)
  const axisOpacity = clamp01(1 - (view.size - GRID_SIZE) / 1.5)
  const bubbleLeft = position.x > 9
  const bubbleBelow = position.y > view.size - 2
  const goal = toSvg(GOAL)
  const worldSize = view.size * CELL
  const marginPercent = (MARGIN * view.zoom / view.width) * 100

  return (
    <div className="map" data-testid="mapa" data-zoom={view.zoom.toFixed(2)}>
      <svg
        viewBox={`${view.x} ${view.y} ${view.width} ${view.width}`}
        className="map-svg"
        role="img"
        aria-label="Mapa quadriculado da Patagônia até Santa Catarina"
      >
        <defs>
          <clipPath id="board">
            <rect x="0" y={-worldSize} width={worldSize} height={worldSize} rx={14 * view.zoom} />
          </clipPath>
          <pattern id="sea-texture" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="1" className="sea-dot" />
          </pattern>
        </defs>

        <g clipPath="url(#board)">
          <rect x="0" y={-worldSize} width={worldSize} height={worldSize} className="map-sea" />
          <rect x="0" y={-worldSize} width={worldSize} height={worldSize} fill="url(#sea-texture)" />
          <path d={SOUTH_AMERICA_PATH} className="map-land" style={NON_SCALING} />
          <path d={AFRICA_PATH} className="map-land" style={NON_SCALING} />

          {WAVES.map((wave) => {
            const svg = toSvg(wave)
            return <path key={`${wave.x}-${wave.y}`} d={`M${svg.x} ${svg.y} q7 -7 14 0 t14 0`} className="map-wave" />
          })}

          <line
            x1="0"
            x2={MAX_WORLD * CELL}
            y1={-EQUATOR_Y * CELL}
            y2={-EQUATOR_Y * CELL}
            className="map-equator"
            style={{ ...NON_SCALING, opacity: expanded }}
          />

          {lines.map((index) => (
            <g key={index} className="map-grid">
              <line x1={index * CELL} y1={0} x2={index * CELL} y2={-MAX_WORLD * CELL} style={NON_SCALING} />
              <line x1={0} y1={-index * CELL} x2={MAX_WORLD * CELL} y2={-index * CELL} style={NON_SCALING} />
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

          <g style={{ opacity: expanded }} aria-hidden={expanded < 0.5}>
            {FAR_DOTS.map((dot) => <CityDot key={`${dot.x}`} at={dot} radius={5 * view.zoom} />)}
            {FAR_LABELS.map((label) => (
              <MapLabel key={label.text} at={label.at} className={label.className} anchor={label.anchor} size={label.size * view.zoom}>
                {label.text}
              </MapLabel>
            ))}
          </g>

          <g className={celebrating ? 'map-goal is-celebrating' : 'map-goal'} transform={`translate(${goal.x} ${goal.y})`}>
            <circle r="24" className="map-goal-halo" />
            <path d={STAR_PATH} className="map-goal-star" />
          </g>
        </g>

        <rect x="0" y={-BASE} width={BASE} height={BASE} rx="14" className="map-frame" style={NON_SCALING} />
        <rect
          x="0"
          y={-worldSize}
          width={worldSize}
          height={worldSize}
          rx={14 * view.zoom}
          className="map-outer-frame"
          style={{ ...NON_SCALING, opacity: expanded }}
        />
        <text
          x={BASE - 10 * view.zoom}
          y={-14 * view.zoom}
          className="map-activity-tag"
          textAnchor="end"
          style={{ opacity: expanded, fontSize: 15 * view.zoom }}
        >
          mapa da atividade
        </text>

        <g style={{ opacity: axisOpacity }}>
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
