import { geoDistance, geoGraticule10, geoInterpolate, geoOrthographic, geoPath } from 'd3-geo'
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { formatKm, formatSquares } from '../game/format'
import { greatCircleKm } from '../game/geo'
import { MAP_JOURNEY } from '../game/journey'
import { EARTH_PLACES, SPACE_PLACES, type ExplorePlace } from '../game/places'
import { kmToSquares } from '../game/route'
import type { LatLon } from '../game/types'
import { LAND } from '../game/world'
import { Penguin } from './Penguin'
import { PostcardStamp } from './PostcardStamp'

type Coordinates = [number, number]
type World = 'terra' | 'espaco'

const SIZE = 1000
const RADIUS = 400
const GRATICULE = geoGraticule10()
const SNAP_KM = 1200
const toCoords = (at: LatLon): Coordinates => [at.lon, at.lat]
const PATAGONIA = EARTH_PLACES[0]

function reducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function nearestPlace(center: Coordinates): ExplorePlace | undefined {
  const here: LatLon = { lon: center[0], lat: center[1] }
  const ranked = EARTH_PLACES
    .map((place) => ({ place, km: place.at ? greatCircleKm(here, place.at) : Infinity }))
    .sort((a, b) => a.km - b.km)
  return ranked[0] && ranked[0].km <= SNAP_KM ? ranked[0].place : undefined
}

/* ---------- Terra: arraste o globo para levar o Pingo ---------- */
function EarthExplorer({ selected, onSelect }: { selected: ExplorePlace; onSelect: (place: ExplorePlace) => void }) {
  const [center, setCenter] = useState<Coordinates>(toCoords(PATAGONIA.at ?? { lat: 0, lon: 0 }))
  const [dragging, setDragging] = useState(false)
  const dragRef = useRef<{ x: number; y: number; center: Coordinates; pin?: string; moved: boolean } | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const flightRef = useRef(0)

  /* Quando escolhem um lugar na lista, o Pingo "voa" até lá. */
  useEffect(() => {
    if (!selected.at || dragRef.current) {
      return
    }
    const target = toCoords(selected.at)
    const from = center
    if (geoDistance(from, target) < 0.01) {
      return
    }
    const interpolate = geoInterpolate(from, target)
    const duration = reducedMotion() ? 1 : 1400
    const startedAt = performance.now()
    cancelAnimationFrame(flightRef.current)
    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / duration)
      const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
      setCenter(interpolate(eased))
      if (t < 1) {
        flightRef.current = requestAnimationFrame(tick)
      }
    }
    flightRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(flightRef.current)
  }, [selected])

  const projection = useMemo(
    () => geoOrthographic().scale(RADIUS).translate([SIZE / 2, SIZE / 2]).rotate([-center[0], -center[1]]).clipAngle(90),
    [center],
  )
  const path = geoPath(projection)

  const startDrag = (event: ReactPointerEvent<SVGSVGElement>) => {
    cancelAnimationFrame(flightRef.current)
    const pin = event.target instanceof Element ? event.target.closest('[data-place-id]')?.getAttribute('data-place-id') ?? undefined : undefined
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = { x: event.clientX, y: event.clientY, center, pin, moved: false }
    setDragging(true)
  }

  const moveDrag = (event: ReactPointerEvent<SVGSVGElement>) => {
    const drag = dragRef.current
    const svg = svgRef.current
    if (!drag || !svg) {
      return
    }
    if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 5) {
      drag.moved = true
    }
    const scale = 180 / svg.getBoundingClientRect().width
    const lon = drag.center[0] + (event.clientX - drag.x) * scale
    const lat = Math.max(-85, Math.min(85, drag.center[1] - (event.clientY - drag.y) * scale))
    setCenter([((lon + 540) % 360) - 180, lat])
  }

  const endDrag = () => {
    const drag = dragRef.current
    dragRef.current = null
    setDragging(false)
    const tapped = drag && !drag.moved && drag.pin ? EARTH_PLACES.find((item) => item.id === drag.pin) : undefined
    if (tapped) {
      onSelect(tapped)
      return
    }
    if (!drag?.moved) {
      return
    }
    const place = nearestPlace(center)
    if (place) {
      onSelect(place)
    }
  }

  const nearby = nearestPlace(center)

  return (
    <div className="explore-globe" data-testid="explorar-globo" data-center={`${center[1].toFixed(1)},${center[0].toFixed(1)}`}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className={dragging ? 'globe-svg is-dragging' : 'globe-svg'}
        role="img"
        aria-label="Globo para explorar. Arraste para levar o Pingo."
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <defs>
          <radialGradient id="explore-shade" cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#e4f3fa" />
            <stop offset="70%" stopColor="#b9dced" />
            <stop offset="100%" stopColor="#8fc3dc" />
          </radialGradient>
        </defs>
        <path d={path({ type: 'Sphere' }) ?? ''} fill="url(#explore-shade)" className="globe-sphere" />
        <path d={path(GRATICULE) ?? ''} className="globe-graticule" />
        <path d={path(LAND) ?? ''} className="globe-land" />
        <path d={path({ type: 'LineString', coordinates: MAP_JOURNEY.points.map(toCoords) }) ?? ''} className="globe-route" />
        {EARTH_PLACES.map((place) => {
          if (!place.at) {
            return null
          }
          const coords = toCoords(place.at)
          const point = projection(coords)
          if (!point || geoDistance(coords, center) > Math.PI / 2 - 0.05) {
            return null
          }
          const active = place.id === selected.id
          return (
            <g
              key={place.id}
              transform={`translate(${point[0]} ${point[1]})`}
              className={active ? 'explore-pin is-active' : 'explore-pin'}
              data-place-id={place.id}
              data-testid={`pino-${place.id}`}
            >
              <circle r={active ? 11 : 7} className={place.group === 'caminho' ? 'explore-dot is-path' : 'explore-dot'} />
              {(active || place.group !== 'caminho') && <text y={-16} textAnchor="middle" className="explore-label">{place.name}</text>}
            </g>
          )
        })}
      </svg>
      <div className={dragging ? 'explore-pingo is-dragging' : 'explore-pingo'} aria-hidden="true">
        <Penguin mood={dragging ? 'normal' : 'feliz'} className="globe-penguin-svg" />
      </div>
      <p className="explore-hint">
        {dragging ? (nearby ? `Perto de ${nearby.name}…` : 'Nadando…') : 'Arraste o globo para levar o Pingo'}
      </p>
    </div>
  )
}

/* ---------- Espaço: arraste o Pingo pela trilha ---------- */
const TRACK = SPACE_PLACES.map((place, index) => ({ place, x: 150 + (index * 700) / (SPACE_PLACES.length - 1) }))

function SpaceExplorer({ selected, onSelect }: { selected: ExplorePlace; onSelect: (place: ExplorePlace) => void }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const selectedX = TRACK.find((stop) => stop.place.id === selected.id)?.x ?? 60
  const [x, setX] = useState(selectedX)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    setX(selectedX)
  }, [selectedX])

  const toSvgX = (clientX: number) => {
    const rect = svgRef.current?.getBoundingClientRect()
    return rect ? ((clientX - rect.left) / rect.width) * SIZE : x
  }

  const nearest = (value: number) => TRACK.reduce((best, stop) => (Math.abs(stop.x - value) < Math.abs(best.x - value) ? stop : best))

  return (
    <div className="explore-space" data-testid="explorar-espaco">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="space-svg"
        role="img"
        aria-label="Trilha do espaço. Arraste o Pingo de planeta em planeta."
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId)
          setDragging(true)
          setX(Math.max(40, Math.min(960, toSvgX(event.clientX))))
        }}
        onPointerMove={(event) => {
          if (dragging) {
            setX(Math.max(40, Math.min(960, toSvgX(event.clientX))))
          }
        }}
        onPointerUp={() => {
          setDragging(false)
          const stop = nearest(x)
          setX(stop.x)
          onSelect(stop.place)
        }}
      >
        <rect width={SIZE} height={SIZE} className="space-bg" />
        {Array.from({ length: 80 }, (_, index) => (
          <circle key={index} cx={(index * 379) % SIZE} cy={(index * 613) % SIZE} r={index % 7 === 0 ? 2.2 : 1} className="space-star" />
        ))}
        <circle cx="60" cy="520" r="44" fill="#6fb6dd" />
        <path d="M40 500 q14 -10 26 0 q4 12 -8 16 q-14 2 -18 -16 Z" fill="#9fd18a" />
        <text x="60" y="600" textAnchor="middle" className="space-label">Terra</text>
        <path d="M100 520 H960" className="space-route" />
        {TRACK.map(({ place, x: stopX }, index) => (
          <g key={place.id} transform={`translate(${stopX} 520)`} className={place.id === selected.id ? 'space-body is-lit' : 'space-body'}>
            <circle r={place.id === 'sol' ? 34 : place.id === 'jupiter' || place.id === 'saturno' ? 26 : 16} fill={SPACE_COLORS[place.id] ?? '#cfd8e0'} />
            {place.id === 'saturno' && <ellipse rx="44" ry="10" className="space-ring" />}
            <text y={index % 2 === 0 ? (place.id === 'sol' ? 64 : 52) : -40} textAnchor="middle" className="space-label">{place.name}</text>
          </g>
        ))}
      </svg>
      <div className="explore-astronaut" style={{ left: `${(x / SIZE) * 100}%` }} aria-hidden="true">
        <Penguin mood="astronauta" className="globe-penguin-svg" />
      </div>
      <p className="explore-hint">Arraste o Pingo de planeta em planeta</p>
    </div>
  )
}

const SPACE_COLORS: Readonly<Record<string, string>> = {
  lua: '#c9c6bd',
  venus: '#e8c27a',
  marte: '#d0603e',
  sol: '#f8b13c',
  jupiter: '#d9a877',
  saturno: '#e7cf94',
  netuno: '#5b84e0',
  plutao: '#cdb9a6',
  proxima: '#ff7b5c',
}

/* ---------- Cartão do lugar escolhido ---------- */
function ExploreCard({ place }: { place: ExplorePlace }) {
  return (
    <article className="explore-card" data-testid="explorar-cartao" data-place={place.id}>
      <PostcardStamp mood={place.mood} sceneId={place.sceneId} tone={place.group === 'espaco' ? 'is-space' : 'is-world'} />
      <div className="explore-card-body">
        <p className="postcard-kicker">{place.region}</p>
        <h2 className="postcard-title">{place.name}</h2>
        <p className="postcard-text">{place.line}</p>
        <dl className="postcard-facts">
          <div>
            <dt>Desde a Patagônia</dt>
            <dd>{formatSquares(kmToSquares(place.km))}</dd>
          </div>
          <div>
            <dt>Em quilômetros</dt>
            <dd>{formatKm(place.km)}</dd>
          </div>
        </dl>
      </div>
    </article>
  )
}

const GROUPS: readonly { id: ExplorePlace['group']; label: string }[] = [
  { id: 'caminho', label: 'No caminho' },
  { id: 'mundo', label: 'Pelo mundo' },
  { id: 'espaco', label: 'No espaço' },
]

/** Modo Explorar: passear pelo mundinho do Pingo, sem conta nenhuma. */
export function Explore() {
  const [world, setWorld] = useState<World>('terra')
  const [selected, setSelected] = useState<ExplorePlace>(PATAGONIA)

  const choose = (place: ExplorePlace) => {
    setSelected(place)
    setWorld(place.group === 'espaco' ? 'espaco' : 'terra')
  }

  return (
    <main className="stage explore" data-testid="explorar">
      <section className="board" aria-label="Mundo do Pingo">
        <div className="explore-switch" role="tablist" aria-label="Onde explorar">
          <button type="button" role="tab" aria-selected={world === 'terra'} className={world === 'terra' ? 'is-on' : ''} onClick={() => choose(PATAGONIA)}>Terra</button>
          <button type="button" role="tab" aria-selected={world === 'espaco'} className={world === 'espaco' ? 'is-on' : ''} onClick={() => choose(SPACE_PLACES[0])}>Espaço</button>
        </div>
        {world === 'terra' && <EarthExplorer selected={selected} onSelect={choose} />}
        {world === 'espaco' && <SpaceExplorer selected={selected} onSelect={choose} />}
      </section>

      <aside className="panel explore-panel" aria-label="Lugares">
        <ExploreCard place={selected} />
        {GROUPS.map((group) => (
          <div key={group.id} className="explore-group">
            <p className="explore-group-label">{group.label}</p>
            <ul className="explore-chips">
              {[...EARTH_PLACES, ...SPACE_PLACES].filter((place) => place.group === group.id).map((place) => (
                <li key={place.id}>
                  <button
                    type="button"
                    className={place.id === selected.id ? 'explore-chip is-on' : 'explore-chip'}
                    onClick={() => choose(place)}
                    data-testid={`ir-${place.id}`}
                  >
                    {place.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>
    </main>
  )
}
