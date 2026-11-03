import { geoDistance, geoGraticule10, geoOrthographic, geoPath, geoRotation } from 'd3-geo'
import { useEffect, useMemo, useRef, useState } from 'react'
import { formatLaps, formatSquares } from '../game/format'
import { KM_PER_CELL } from '../game/config'
import { EARTH_CIRCUMFERENCE_KM } from '../game/geo'
import { journeyTo, MAP_JOURNEY, pointAtKm, traveledPoints } from '../game/journey'
import { REACHED_DESTINATIONS } from '../game/interpreter'
import { PATH_END_KM, positionAtHops } from '../game/route'
import type { Interpretation, LatLon } from '../game/types'
import { LAND } from '../game/world'
import { Penguin } from './Penguin'

type GlobeSceneProps = {
  interpretation: Interpretation
  /** Quando falso, mostra o estado final direto (sem animar). */
  animate: boolean
  onProgress: (km: number) => void
  onDone: () => void
}

type Coordinates = [number, number]

const SIZE = 1000
const RADIUS = 380
const GRATICULE = geoGraticule10()
const MAX_VISIBLE_LAPS = 8
const RING_COLORS = ['#2f6fd6', '#ff7a2f', '#2f9e8f', '#e2574c', '#8a63d2', '#f6b93b', '#3aa3c9', '#c2410c']

const toCoords = (at: LatLon): Coordinates => [at.lon, at.lat]

function reducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
}

/** Cada volta é um grande círculo com uma inclinação diferente, como um novelo. */
function ringRotation(index: number) {
  return geoRotation([-65 + index * 47, -20, 24 + index * 21])
}

function ringPoint(index: number, fraction: number): Coordinates {
  const point = ringRotation(index)([fraction * 360 - 180, 0])
  return [point[0], point[1]]
}

function ringCoords(index: number, fraction: number): Coordinates[] {
  const steps = Math.max(2, Math.ceil(fraction * 120))
  return Array.from({ length: steps + 1 }, (_, step) => ringPoint(index, (step / steps) * fraction))
}

function travelAt(progress: number): number {
  return easeInOut(progress)
}

function odometerAt(interpretation: Interpretation, progress: number): number {
  return interpretation.km * travelAt(progress)
}

/** Ritmo calmo: dá tempo de ler o que o Pingo fala. */
function durationFor(interpretation: Interpretation): number {
  if (reducedMotion()) {
    return 300
  }
  if (interpretation.scene === 'voltas') {
    return Math.min(16000, Math.max(5000, Math.min(interpretation.laps ?? 1, MAX_VISIBLE_LAPS) * 2400))
  }
  return 15000
}

export function GlobeScene({ interpretation, animate, onProgress, onDone }: GlobeSceneProps) {
  const [progress, setProgress] = useState(animate ? 0 : 1)
  const doneRef = useRef(onDone)
  const progressRef = useRef(onProgress)
  doneRef.current = onDone
  progressRef.current = onProgress

  useEffect(() => {
    if (!animate) {
      setProgress(1)
      return
    }
    const duration = durationFor(interpretation)
    const startedAt = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / duration)
      setProgress(t)
      progressRef.current(odometerAt(interpretation, t))
      if (t < 1) {
        frame = requestAnimationFrame(tick)
        return
      }
      doneRef.current()
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [interpretation, animate])

  const laps = interpretation.laps ?? 0
  const isLaps = interpretation.scene === 'voltas'
  const destination = interpretation.destination
  const journey = useMemo(
    () => (destination ? journeyTo(destination.id, destination.at) : MAP_JOURNEY),
    [destination],
  )
  const travel = travelAt(progress)
  const visibleLaps = Math.min(laps, MAX_VISIBLE_LAPS)
  const lapProgress = visibleLaps * travel
  const currentLap = Math.min(Math.floor(lapProgress), Math.ceil(visibleLaps) - 1)
  const lapFraction = lapProgress - currentLap

  const kmNow = journey.totalKm * travel
  const penguin: Coordinates = isLaps ? ringPoint(Math.max(0, currentLap), lapFraction) : toCoords(pointAtKm(journey, kmNow))
  const center: Coordinates = penguin
  const greeting = isLaps
    ? undefined
    : progress >= 1 && destination
      ? `Cheguei em ${destination.name}!`
      : kmNow < PATH_END_KM ? positionAtHops(kmNow / KM_PER_CELL).greeting : undefined

  const projection = geoOrthographic()
    .scale(RADIUS)
    .translate([SIZE / 2, SIZE / 2])
    .rotate([-center[0], -center[1] * 0.75])
    .clipAngle(90)
  const path = geoPath(projection)
  const projected = projection(penguin)
  const penguinVisible = geoDistance(penguin, [center[0], center[1] * 0.75]) < Math.PI / 2
  const shownLaps = isLaps ? laps * travel : 0

  const traveled: Coordinates[] = isLaps ? [] : traveledPoints(journey, kmNow).map(toCoords)
  const fullRoute: Coordinates[] = journey.points.map(toCoords)
  const reached = REACHED_DESTINATIONS.filter((item) => item.km <= interpretation.km)
  const destinationPoint = destination ? projection(toCoords(destination.at)) : null

  return (
    <div className="globe" data-testid="globo" data-scene={interpretation.scene} data-progress={progress.toFixed(2)}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="globe-svg" role="img" aria-label="Globo terrestre com a viagem do Pingo">
        <defs>
          <radialGradient id="globe-shade" cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#e4f3fa" />
            <stop offset="70%" stopColor="#b9dced" />
            <stop offset="100%" stopColor="#8fc3dc" />
          </radialGradient>
          <radialGradient id="globe-halo" cx="50%" cy="50%" r="50%">
            <stop offset="78%" stopColor="#cfe8f3" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#cfe8f3" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS * 1.16} fill="url(#globe-halo)" />
        <path d={path({ type: 'Sphere' }) ?? ''} fill="url(#globe-shade)" className="globe-sphere" />
        <path d={path(GRATICULE) ?? ''} className="globe-graticule" />
        <path d={path(LAND) ?? ''} className="globe-land" />

        {!isLaps && <path d={path({ type: 'LineString', coordinates: fullRoute }) ?? ''} className="globe-route" />}

        {!isLaps && reached.map((item) => {
          const point = projection(toCoords(item.at))
          const visible = geoDistance(toCoords(item.at), [center[0], center[1] * 0.75]) < Math.PI / 2
          if (!point || !visible) {
            return null
          }
          return <circle key={item.id} cx={point[0]} cy={point[1]} r={item.id === destination?.id ? 9 : 5} className={item.id === destination?.id ? 'globe-dot is-target' : 'globe-dot'} />
        })}

        {!isLaps && traveled.length > 1 && (
          <path d={path({ type: 'LineString', coordinates: traveled }) ?? ''} className="globe-trail" data-testid="rastro-globo" />
        )}

        {isLaps && Array.from({ length: Math.ceil(visibleLaps) }, (_, index) => {
          const fraction = index < currentLap ? 1 : index === currentLap ? lapFraction : 0
          if (fraction <= 0) {
            return null
          }
          return (
            <path
              key={index}
              d={path({ type: 'LineString', coordinates: ringCoords(index, fraction) }) ?? ''}
              className={index === currentLap ? 'globe-ring is-current' : 'globe-ring'}
              stroke={RING_COLORS[index % RING_COLORS.length]}
              data-testid="volta"
            />
          )
        })}

        {!isLaps && destination && destinationPoint && progress < 0.9 && (
          <g className="globe-target" transform={`translate(${destinationPoint[0]} ${destinationPoint[1]})`}>
            <text y={-22} textAnchor="middle" className="globe-label">{destination.name}</text>
          </g>
        )}
      </svg>

      {projected && (
        <div
          className={progress < 1 ? 'globe-penguin is-traveling' : 'globe-penguin'}
          style={{ left: `${(projected[0] / SIZE) * 100}%`, top: `${(projected[1] / SIZE) * 100}%`, opacity: penguinVisible ? 1 : 0.15 }}
        >
          <Penguin mood={progress < 1 ? 'normal' : 'feliz'} className="globe-penguin-svg" />
        </div>
      )}

      {projected && greeting && (
        <div
          key={greeting}
          className="map-bubble"
          style={{ left: `${(projected[0] / SIZE) * 100}%`, top: `${(projected[1] / SIZE) * 100}%` }}
          data-testid="balao-globo"
        >
          {greeting}
        </div>
      )}

      {isLaps && (
        <div className="globe-counter" data-testid="contador-voltas">
          <span className="globe-counter-value">{formatLaps(shownLaps)}</span>
          <span className="globe-counter-note">1 volta na Terra = {formatSquares(EARTH_CIRCUMFERENCE_KM / 150)}</span>
          {laps > MAX_VISIBLE_LAPS && <span className="globe-counter-note">desenhando só {MAX_VISIBLE_LAPS} voltas, senão vira um novelo</span>}
        </div>
      )}

    </div>
  )
}
