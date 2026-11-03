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

/* ---------- Terra: arraste o Pingo pelo globo ---------- */

/** A partir daqui (fração do raio), levar o Pingo para a borda faz o globo girar. */
const EDGE_START = 0.65
/** Quanto o globo gira por quadro quando o Pingo está bem na borda. */
const EDGE_SPEED = 0.008

function projectionFor(center: Coordinates) {
  return geoOrthographic().scale(RADIUS).translate([SIZE / 2, SIZE / 2]).rotate([-center[0], -center[1]]).clipAngle(90)
}

/** Ponto do globo embaixo do dedo (preso à borda se o dedo sair do globo). */
function pointUnder(screen: Coordinates, center: Coordinates): Coordinates | null {
  const dx = screen[0] - SIZE / 2
  const dy = screen[1] - SIZE / 2
  const distance = Math.hypot(dx, dy)
  const limit = RADIUS * 0.97
  const factor = distance > limit ? limit / distance : 1
  const inverted = projectionFor(center).invert?.([SIZE / 2 + dx * factor, SIZE / 2 + dy * factor])
  return inverted ? [inverted[0], inverted[1]] : null
}

function EarthExplorer({ selected, onSelect }: { selected: ExplorePlace; onSelect: (place: ExplorePlace) => void }) {
  const start = toCoords(PATAGONIA.at ?? { lat: 0, lon: 0 })
  const [center, setCenter] = useState<Coordinates>(start)
  const [pingo, setPingo] = useState<Coordinates>(start)
  const [dragging, setDragging] = useState(false)
  const centerRef = useRef(center)
  const pingoRef = useRef(pingo)
  const pointerRef = useRef<Coordinates | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const flightRef = useRef(0)
  const dragFrameRef = useRef(0)
  centerRef.current = center
  pingoRef.current = pingo

  /** Leva o Pingo (e o centro do globo) até `target`, suavemente. */
  const flyTo = (target: Coordinates) => {
    const fromCenter = centerRef.current
    const fromPingo = pingoRef.current
    if (geoDistance(fromCenter, target) < 0.01 && geoDistance(fromPingo, target) < 0.01) {
      return
    }
    const moveCenter = geoInterpolate(fromCenter, target)
    const movePingo = geoInterpolate(fromPingo, target)
    const duration = reducedMotion() ? 1 : 1200
    const startedAt = performance.now()
    cancelAnimationFrame(flightRef.current)
    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / duration)
      const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
      setCenter(moveCenter(eased))
      setPingo(movePingo(eased))
      if (t < 1) {
        flightRef.current = requestAnimationFrame(tick)
      }
    }
    flightRef.current = requestAnimationFrame(tick)
  }

  /* Quando escolhem um lugar (na lista ou soltando o Pingo perto), ele vai até lá. */
  useEffect(() => {
    if (!selected.at || pointerRef.current) {
      return
    }
    flyTo(toCoords(selected.at))
    return () => cancelAnimationFrame(flightRef.current)
  }, [selected])

  useEffect(() => () => cancelAnimationFrame(dragFrameRef.current), [])

  const projection = useMemo(() => projectionFor(center), [center])
  const path = geoPath(projection)
  const pingoOnScreen = projection(pingo) ?? [SIZE / 2, SIZE / 2]

  const toScreen = (clientX: number, clientY: number): Coordinates | null => {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0) {
      return null
    }
    return [((clientX - rect.left) / rect.width) * SIZE, ((clientY - rect.top) / rect.height) * SIZE]
  }

  /** Enquanto arrasta: o Pingo fica embaixo do dedo; perto da borda, o globo gira para ele seguir. */
  const dragFrame = () => {
    const pointer = pointerRef.current
    if (!pointer) {
      return
    }
    const reach = Math.hypot(pointer[0] - SIZE / 2, pointer[1] - SIZE / 2) / RADIUS
    const under = pointUnder(pointer, centerRef.current)
    if (under && reach > EDGE_START) {
      const speed = EDGE_SPEED * Math.min(1, (reach - EDGE_START) / (1 - EDGE_START))
      const turned = geoInterpolate(centerRef.current, under)(speed)
      const nextCenter: Coordinates = [turned[0], Math.max(-80, Math.min(80, turned[1]))]
      centerRef.current = nextCenter
      setCenter(nextCenter)
    }
    const next = pointUnder(pointer, centerRef.current)
    if (next) {
      pingoRef.current = next
      setPingo(next)
    }
    dragFrameRef.current = requestAnimationFrame(dragFrame)
  }

  const grabPingo = (event: ReactPointerEvent<HTMLDivElement>) => {
    const screen = toScreen(event.clientX, event.clientY)
    if (!screen) {
      return
    }
    event.preventDefault()
    cancelAnimationFrame(flightRef.current)
    event.currentTarget.setPointerCapture(event.pointerId)
    pointerRef.current = screen
    setDragging(true)
    cancelAnimationFrame(dragFrameRef.current)
    dragFrameRef.current = requestAnimationFrame(dragFrame)
  }

  const movePingo = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointerRef.current) {
      return
    }
    pointerRef.current = toScreen(event.clientX, event.clientY) ?? pointerRef.current
  }

  const dropPingo = () => {
    if (!pointerRef.current) {
      return
    }
    pointerRef.current = null
    cancelAnimationFrame(dragFrameRef.current)
    setDragging(false)
    const place = nearestPlace(pingoRef.current)
    if (place && place.id !== selected.id) {
      onSelect(place)
      return
    }
    flyTo(place?.at ? toCoords(place.at) : pingoRef.current)
  }

  /** Tocar num lugar do globo também leva o Pingo até lá. */
  const tapPlace = (event: ReactPointerEvent<SVGSVGElement>) => {
    const id = event.target instanceof Element ? event.target.closest('[data-place-id]')?.getAttribute('data-place-id') : null
    const place = id ? EARTH_PLACES.find((item) => item.id === id) : undefined
    if (place) {
      onSelect(place)
    }
  }

  const nearby = nearestPlace(pingo)

  return (
    <div
      className="explore-globe"
      data-testid="explorar-globo"
      data-center={`${center[1].toFixed(1)},${center[0].toFixed(1)}`}
      data-pingo={`${pingo[1].toFixed(1)},${pingo[0].toFixed(1)}`}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="globe-svg"
        role="img"
        aria-label="Globo para explorar. Arraste o Pingo para levá-lo pelo mundo."
        onPointerUp={tapPlace}
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
      <div
        className={dragging ? 'explore-pingo is-dragging' : 'explore-pingo'}
        style={{ left: `${(pingoOnScreen[0] / SIZE) * 100}%`, top: `${(pingoOnScreen[1] / SIZE) * 100}%` }}
        role="button"
        tabIndex={-1}
        aria-label="Pingo: arraste para levá-lo pelo mundo"
        data-testid="explorar-pingo"
        onPointerDown={grabPingo}
        onPointerMove={movePingo}
        onPointerUp={dropPingo}
        onPointerCancel={dropPingo}
      >
        <Penguin mood={dragging ? 'normal' : 'feliz'} className="globe-penguin-svg" />
      </div>
      <p className="explore-hint">
        {dragging ? (nearby ? `Perto de ${nearby.name}…` : 'Nadando…') : 'Arraste o Pingo para levá-lo pelo mundo'}
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
