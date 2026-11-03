import { geoEquirectangular, geoPath } from 'd3-geo'
import { useMemo } from 'react'
import { KM_PER_CELL } from '../game/config'
import { formatKm } from '../game/format'
import { positionOn } from '../game/interpreter'
import { CELLS_PER_DEGREE, toGrid, type GridFrame, type Trip } from '../game/trip'
import type { GridPoint, PenguinMood } from '../game/types'
import { LAND } from '../game/world'
import { Penguin } from './Penguin'

/** Unidades SVG por quadradinho (igual ao mapa da atividade). */
const CELL = 60
const STAR_PATH = 'M0 -17 L5 -5.5 L17.5 -5.2 L7.8 2.8 L11 15 L0 8 L-11 15 L-7.8 2.8 L-17.5 -5.2 L-5 -5.5 Z'
const NON_SCALING = { vectorEffect: 'non-scaling-stroke' } as const
/** A partir daqui o caminho ganha marcações de 10 em 10 quadradinhos. */
export const LONG_ROUTE_SQUARES = 40
const TICK_EVERY = 10

type RouteMapProps = {
  trip: Trip
  hops: number
  traveling: boolean
  mood: PenguinMood
  celebrating: boolean
  hidden: boolean
}

type View = { minX: number; minY: number; size: number }

const toSvg = (point: GridPoint): GridPoint => ({ x: point.x * CELL, y: -point.y * CELL })

/** Quadrado que mostra a saída, a chegada e o caminho inteiro, com folga. */
function viewFor(trip: Trip, frame: GridFrame): View {
  const points = [...trip.cells, toGrid(trip.from.at, frame), toGrid(trip.to.at, frame)]
  const xs = points.map((point) => point.x)
  const ys = points.map((point) => point.y)
  const width = Math.max(...xs) - Math.min(...xs)
  const height = Math.max(...ys) - Math.min(...ys)
  const margin = Math.max(2, Math.max(width, height) * 0.12)
  const size = Math.ceil(Math.max(width, height) + margin * 2)
  const minX = Math.floor((Math.min(...xs) + Math.max(...xs)) / 2 - size / 2)
  const minY = Math.floor((Math.min(...ys) + Math.max(...ys)) / 2 - size / 2)
  return { minX, minY, size }
}

/** Continentes desenhados no quadriculado desta viagem. */
function landPath(frame: GridFrame): string {
  const projection = geoEquirectangular()
    .rotate([-frame.lon0, 0])
    .scale(CELLS_PER_DEGREE * (180 / Math.PI) * CELL)
    .translate([0, 0])
  return geoPath(projection)(LAND) ?? ''
}

function polyline(points: readonly GridPoint[]): string {
  return points.map((point) => {
    const svg = toSvg(point)
    return `${svg.x.toFixed(1)},${svg.y.toFixed(1)}`
  }).join(' ')
}

export function RouteMap({ trip, hops, traveling, mood, celebrating, hidden }: RouteMapProps) {
  const frame = trip.frame
  const view = useMemo(() => (frame ? viewFor(trip, frame) : null), [trip, frame])
  const land = useMemo(() => (frame ? landPath(frame) : ''), [frame])
  if (!frame || !view) {
    return null
  }

  const position = positionOn(trip, hops)
  const index = Math.floor(position.hops)
  const trail = [...trip.cells.slice(0, index + 1), position]
  const box = { x: view.minX * CELL, y: -(view.minY + view.size) * CELL, width: view.size * CELL }
  const zoom = view.size / 15
  const toPercent = (point: GridPoint) => {
    const svg = toSvg(point)
    return { left: `${((svg.x - box.x) / box.width) * 100}%`, top: `${((svg.y - box.y) / box.width) * 100}%` }
  }
  const start = toSvg(trip.cells[0])
  const goal = toSvg(trip.cells[trip.cells.length - 1])
  const arrived = position.hops >= trip.squares - 0.001
  const greeting = arrived ? `Cheguei em ${trip.to.name}!` : position.hops < 1.5 ? `Tchau, ${trip.from.name}!` : undefined
  const ticks = trip.squares > LONG_ROUTE_SQUARES
    ? Array.from({ length: Math.floor((trip.squares - 1) / TICK_EVERY) }, (_, tick) => (tick + 1) * TICK_EVERY)
    : []
  const columns = Array.from({ length: view.size + 1 }, (_, line) => view.minX + line)
  const rows = Array.from({ length: view.size + 1 }, (_, line) => view.minY + line)
  const gridOpacity = Math.min(1, 30 / view.size)
  const labelSize = 15 * zoom
  const goalPoint = { x: trip.cells[trip.cells.length - 1].x, y: trip.cells[trip.cells.length - 1].y }

  return (
    <div className="map is-route" data-testid="mapa" data-squares={trip.squares} data-zoom={zoom.toFixed(2)}>
      <svg
        viewBox={`${box.x} ${box.y} ${box.width} ${box.width}`}
        className="map-svg"
        role="img"
        aria-label={`Mapa quadriculado de ${trip.from.name} até ${trip.to.name}`}
      >
        <defs>
          <clipPath id="route-board">
            <rect x={box.x} y={box.y} width={box.width} height={box.width} rx={14 * zoom} />
          </clipPath>
        </defs>

        <g clipPath="url(#route-board)">
          <rect x={box.x} y={box.y} width={box.width} height={box.width} className="map-sea" />
          <g transform={`translate(0 ${frame.lat0 * CELLS_PER_DEGREE * CELL}) scale(${frame.cos0} 1)`}>
            <path d={land} className="map-land" style={NON_SCALING} />
          </g>

          <g className="map-grid" style={{ opacity: gridOpacity }}>
            {columns.map((column) => (
              <line key={`c${column}`} x1={column * CELL} x2={column * CELL} y1={box.y} y2={box.y + box.width} style={NON_SCALING} />
            ))}
            {rows.map((row) => (
              <line key={`r${row}`} x1={box.x} x2={box.x + box.width} y1={-row * CELL} y2={-row * CELL} style={NON_SCALING} />
            ))}
          </g>

          <polyline points={polyline(trip.cells)} className="map-route" style={{ ...NON_SCALING, strokeDasharray: `0 ${9 * zoom}` }} />
          <polyline points={polyline(trail)} className="map-trail" data-testid="rastro" style={{ ...NON_SCALING, strokeDasharray: `0 ${9 * zoom}` }} />

          {ticks.map((tick) => {
            const at = toSvg(trip.cells[tick])
            return (
              <g key={tick} className="map-tick" transform={`translate(${at.x} ${at.y})`} data-testid="marca-10">
                <circle r={9 * zoom} />
                <text y={4 * zoom} textAnchor="middle" style={{ fontSize: 10 * zoom }}>{tick}</text>
              </g>
            )
          })}

          <circle cx={start.x} cy={start.y} r={7 * zoom} className="map-city" style={NON_SCALING} />
          <text x={start.x} y={start.y + 26 * zoom} textAnchor="middle" className="map-region" style={{ fontSize: labelSize * 1.4 }}>
            {trip.from.name}
          </text>
          <text x={goal.x} y={goal.y - 26 * zoom} textAnchor="middle" className="map-region" style={{ fontSize: labelSize * 1.4 }}>
            {trip.to.name}
          </text>

          <g className={celebrating ? 'map-goal is-celebrating' : 'map-goal'} transform={`translate(${goal.x} ${goal.y}) scale(${zoom})`}>
            <circle r="24" className="map-goal-halo" />
            <path d={STAR_PATH} className="map-goal-star" />
          </g>
        </g>

        <rect x={box.x} y={box.y} width={box.width} height={box.width} rx={14 * zoom} className="map-frame" style={NON_SCALING} />
      </svg>

      <div className="map-legend" data-testid="legenda" style={{ left: '12px', bottom: '12px' }}>
        <span>1 quadradinho = {formatKm(KM_PER_CELL)}</span>
        {ticks.length > 0 && <span className="map-legend-note">cada bolinha = {TICK_EVERY} quadradinhos</span>}
        <span className="map-legend-bar" style={{ width: `${(CELL / box.width) * 100}cqw` }} />
      </div>

      <div
        className={traveling ? 'map-penguin is-traveling' : 'map-penguin'}
        style={toPercent(position)}
        data-testid="pinguim"
        data-hops={position.hops.toFixed(2)}
      >
        <Penguin mood={traveling ? 'normal' : mood} className="map-penguin-svg" />
      </div>

      {greeting && !hidden && (
        <div
          key={greeting}
          className={['map-bubble', position.x > goalPoint.x - 1 ? 'is-left' : ''].join(' ').trim()}
          style={toPercent(position)}
          data-testid="balao"
        >
          {greeting}
        </div>
      )}
    </div>
  )
}
