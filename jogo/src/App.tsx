import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { Explore } from './components/Explore'
import { Confetti } from './components/Confetti'
import { ControlPanel } from './components/ControlPanel'
import { DeparturePostcard } from './components/DeparturePostcard'
import { GlobeScene } from './components/GlobeScene'
import { MapBoard } from './components/MapBoard'
import { Penguin } from './components/Penguin'
import { Postcard } from './components/Postcard'
import { RouteMap } from './components/RouteMap'
import { SpaceScene } from './components/SpaceScene'
import { KM_PER_CELL } from './game/config'
import { kmToSquares } from './game/route'
import { gameReducer, hasWon, initialState, isTraveling } from './game/state'
import { fromPlace, untilPlace } from './game/format'
import { DEFAULT_FROM, DEFAULT_TO } from './game/stops'
import { buildTrip } from './game/trip'
import { postcardDelay, useTravel } from './hooks/useTravel'

function focusInput() {
  requestAnimationFrame(() => document.getElementById('km')?.focus())
}

export default function App() {
  const [mode, setMode] = useState<'jogar' | 'explorar'>('jogar')
  const [state, dispatch] = useReducer(gameReducer, initialState)
  const [route, setRoute] = useState({ from: DEFAULT_FROM, to: DEFAULT_TO })
  const [departing, setDeparting] = useState(false)
  const trip = useMemo(() => buildTrip(route.from, route.to), [route])
  const [sceneKm, setSceneKm] = useState(0)
  const interpretation = state.interpretation
  const onMap = interpretation !== null && interpretation.scene === 'mapa'
  const targetHops = onMap ? Math.min(kmToSquares(interpretation.km), trip.squares) : 0

  const mapDone = useCallback(() => dispatch({ type: 'mapa-fim' }), [])
  const sceneDone = useCallback(() => dispatch({ type: 'cena-fim' }), [])
  const hops = useTravel(state.tripId, targetHops, onMap, mapDone)

  useEffect(() => {
    if (state.phase !== 'resultado') {
      return
    }
    const timer = window.setTimeout(() => dispatch({ type: 'abrir-postal' }), postcardDelay())
    return () => window.clearTimeout(timer)
  }, [state.phase, state.tripId])

  const won = hasWon(state)
  const traveling = isTraveling(state)
  const showScene = interpretation !== null && interpretation.scene !== 'mapa' && (state.phase === 'cena' || state.phase === 'resultado')
  const odometerKm = state.phase === 'cena' ? sceneKm : hops * KM_PER_CELL
  const mood = state.phase === 'resultado' && interpretation?.scene === 'mapa' ? interpretation.mood : 'normal'

  const retry = () => {
    dispatch({ type: 'tentar-de-novo' })
    focusInput()
  }
  const restart = () => {
    dispatch({ type: 'recomecar' })
    focusInput()
  }
  const changeRoute = (from: string, to: string) => {
    if (from === to) {
      return
    }
    setRoute({ from, to })
    dispatch({ type: 'tentar-de-novo' })
    setDeparting(true)
  }
  const go = () => {
    setDeparting(false)
    focusInput()
  }
  const swim = (km: number) => {
    setDeparting(false)
    dispatch({ type: 'nadar', km, trip })
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true"><Penguin mood="feliz" size={40} /></span>
          <div>
            <h1 className="brand-title">A viagem do Pingo</h1>
            <p className="brand-subtitle" data-testid="rota">
              {`${fromPlace(trip.from.name).replace(/^d/, 'D')} ${untilPlace(trip.to.name)}`}
            </p>
          </div>
        </div>
        <nav className="mode-switch" aria-label="Modo">
          <button type="button" className={mode === 'jogar' ? 'is-on' : ''} aria-pressed={mode === 'jogar'} onClick={() => setMode('jogar')} data-testid="modo-jogar">Jogar</button>
          <button type="button" className={mode === 'explorar' ? 'is-on' : ''} aria-pressed={mode === 'explorar'} onClick={() => setMode('explorar')} data-testid="modo-explorar">Explorar</button>
        </nav>
      </header>

      {mode === 'explorar' && <Explore />}

      {mode === 'jogar' && (
      <main className="stage">
        <section className="board" aria-label="Mapa">
          {trip.classic && (
            <MapBoard hops={hops} traveling={state.phase === 'mapa'} mood={mood} celebrating={won} hidden={showScene} reverse={trip.classic === 'volta'} />
          )}
          {!trip.classic && (
            <RouteMap key={`${trip.from.id}-${trip.to.id}`} trip={trip} hops={hops} traveling={state.phase === 'mapa'} mood={mood} celebrating={won} hidden={showScene} />
          )}

          {showScene && interpretation && (
            <div className="scene-layer" key={state.tripId}>
              {interpretation.scene === 'espaco' && (
                <SpaceScene interpretation={interpretation} animate onProgress={setSceneKm} onDone={sceneDone} />
              )}
              {interpretation.scene !== 'espaco' && (
                <GlobeScene trip={trip} interpretation={interpretation} animate onProgress={setSceneKm} onDone={sceneDone} />
              )}
            </div>
          )}

          {won && <Confetti />}

          {departing && !traveling && <DeparturePostcard trip={trip} onGo={go} />}

          {state.postcardOpen && interpretation && (
            <Postcard
              interpretation={interpretation}
              onLook={() => dispatch({ type: 'ver-mapa' })}
              onRetry={retry}
              onRestart={restart}
            />
          )}
        </section>

        <ControlPanel
          key={`${state.gameId}-${trip.from.id}-${trip.to.id}`}
          fromId={trip.from.id}
          toId={trip.to.id}
          onRoute={changeRoute}
          traveling={traveling}
          locked={won}
          odometerKm={odometerKm}
          onSwim={swim}
          onRestart={restart}
        />
      </main>
      )}
    </div>
  )
}
