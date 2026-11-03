import { geoGraticule10, geoOrthographic, geoPath } from 'd3-geo'
import { useEffect, useMemo, useRef, useState } from 'react'
import { SPACE_BODIES } from '../game/destinations'
import { formatSquares } from '../game/format'
import { EARTH_CIRCUMFERENCE_KM } from '../game/geo'
import { kmToSquares } from '../game/route'
import type { Interpretation } from '../game/types'
import { LAND } from '../game/world'
import { Penguin } from './Penguin'

type SpaceSceneProps = {
  interpretation: Interpretation
  animate: boolean
  onProgress: (km: number) => void
  onDone: () => void
}

const SIZE = 1000
const EARTH = { x: 190, y: 790, r: 105 }
const TARGET = { x: 800, y: 250 }
const CONTROL = { x: 260, y: 220 }

function reducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
}

/** Ponto na curva de viagem (Bézier quadrática). */
function curvePoint(t: number): { x: number; y: number } {
  const a = (1 - t) ** 2
  const b = 2 * (1 - t) * t
  const c = t ** 2
  return {
    x: a * EARTH.x + b * CONTROL.x + c * TARGET.x,
    y: a * EARTH.y + b * CONTROL.y + c * TARGET.y,
  }
}

const STARS = Array.from({ length: 90 }, (_, index) => ({
  x: (index * 379) % SIZE,
  y: (index * 613) % SIZE,
  r: index % 7 === 0 ? 2.2 : index % 3 === 0 ? 1.4 : 0.9,
}))

const earthProjection = geoOrthographic().scale(EARTH.r).translate([EARTH.x, EARTH.y]).rotate([55, 15]).clipAngle(90)
const earthPath = geoPath(earthProjection)
const EARTH_SPHERE = earthPath({ type: 'Sphere' }) ?? ''
const EARTH_GRATICULE = earthPath(geoGraticule10()) ?? ''
const EARTH_LAND = earthPath(LAND) ?? ''

const LOG_START = Math.log(EARTH_CIRCUMFERENCE_KM)

function odometerAt(km: number, progress: number): number {
  return Math.exp(LOG_START + (Math.log(km) - LOG_START) * easeInOut(progress))
}

export function SpaceScene({ interpretation, animate, onProgress, onDone }: SpaceSceneProps) {
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
    const duration = reducedMotion() ? 300 : 10000
    const startedAt = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / duration)
      setProgress(t)
      progressRef.current(odometerAt(interpretation.km, t))
      if (t < 1) {
        frame = requestAnimationFrame(tick)
        return
      }
      doneRef.current()
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [interpretation, animate])

  const body = interpretation.body ?? SPACE_BODIES[0]
  const logEnd = Math.log(body.km)
  const odometer = odometerAt(interpretation.km, progress)

  /* As paradas ficam numa régua logarítmica: o desenho é fora de escala, as contas não. */
  const stops = useMemo(
    () => SPACE_BODIES.filter((item) => item.km <= body.km).map((item) => {
      const t = item.id === body.id ? 1 : 0.18 + 0.72 * ((Math.log(item.km) - LOG_START) / (logEnd - LOG_START))
      return { item, t, point: curvePoint(t) }
    }),
    [body.id, body.km, logEnd],
  )

  const penguinT = Math.min(1, Math.max(0, (Math.log(odometer) - LOG_START) / (logEnd - LOG_START)))
  const penguin = curvePoint(penguinT)
  const trail = Array.from({ length: 41 }, (_, step) => curvePoint((step / 40) * penguinT))
  const fullCurve = `M${EARTH.x} ${EARTH.y} Q${CONTROL.x} ${CONTROL.y} ${TARGET.x} ${TARGET.y}`

  return (
    <div className="space" data-testid="espaco" data-body={body.id}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="space-svg" role="img" aria-label={`Viagem do Pingo até ${body.label}`}>
        <rect width={SIZE} height={SIZE} className="space-bg" />
        {STARS.map((star, index) => (
          <circle key={index} cx={star.x} cy={star.y} r={star.r} className="space-star" style={{ animationDelay: `${(index % 9) * 400}ms` }} />
        ))}

        <path d={fullCurve} className="space-route" />
        <polyline points={trail.map((point) => `${point.x},${point.y}`).join(' ')} className="space-trail" />

        <path d={EARTH_SPHERE} className="space-earth-sea" />
        <path d={EARTH_GRATICULE} className="space-earth-graticule" />
        <path d={EARTH_LAND} className="space-earth-land" />
        <text x={EARTH.x} y={EARTH.y + EARTH.r + 36} textAnchor="middle" className="space-label">Terra</text>

        {stops.map(({ item, point }) => {
          const isTarget = item.id === body.id
          const radius = isTarget ? 40 * Math.max(0.6, Math.min(item.radius, 2.4)) : 7 + item.radius * 4
          const lit = penguinT >= (isTarget ? 0.98 : stops.find((stop) => stop.item.id === item.id)?.t ?? 1) - 0.01
          return (
            <g key={item.id} className={lit ? 'space-body is-lit' : 'space-body'} transform={`translate(${point.x} ${point.y})`}>
              {item.id === 'sol' && isTarget && <circle r={radius * 1.5} className="space-sun-glow" />}
              <circle r={radius} fill={item.color} />
              {item.id === 'saturno' && <ellipse rx={radius * 1.7} ry={radius * 0.45} className="space-ring" />}
              <text y={isTarget ? radius + 34 : -radius - 12} textAnchor="middle" className={isTarget ? 'space-label is-target' : 'space-label'}>
                {item.name}
              </text>
              {isTarget && (
                <text y={radius + 60} textAnchor="middle" className="space-sublabel">
                  {formatSquares(kmToSquares(item.km))}
                </text>
              )}
            </g>
          )
        })}

        <text x={SIZE - 24} y={SIZE - 24} textAnchor="end" className="space-note">desenho fora de escala — as contas não</text>
      </svg>

      <div
        className={progress < 1 ? 'space-penguin is-traveling' : 'space-penguin'}
        style={{ left: `${(penguin.x / SIZE) * 100}%`, top: `${(penguin.y / SIZE) * 100}%` }}
      >
        <Penguin mood="astronauta" className="globe-penguin-svg" />
      </div>

      <div className="globe-counter is-space" data-testid="contador-espaco">
        <span className="globe-counter-value">{formatSquares(kmToSquares(odometer))}</span>
        <span className="globe-counter-note">cada quadradinho continua valendo 150 km</span>
      </div>
    </div>
  )
}
