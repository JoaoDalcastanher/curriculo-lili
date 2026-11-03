import { useCallback, useEffect, useReducer, useState } from 'react'
import { Explore } from './components/Explore'
import { Confetti } from './components/Confetti'
import { ControlPanel } from './components/ControlPanel'
import { GlobeScene } from './components/GlobeScene'
import { MapBoard } from './components/MapBoard'
import { Postcard } from './components/Postcard'
import { SpaceScene } from './components/SpaceScene'
import { KM_PER_CELL } from './game/config'
import { kmToSquares, PATH_END_HOPS } from './game/route'
import { gameReducer, hasWon, initialState, isTraveling } from './game/state'
import { postcardDelay, useTravel } from './hooks/useTravel'

function focusInput() {
  requestAnimationFrame(() => document.getElementById('km')?.focus())
}

export default function App() {
  const [mode, setMode] = useState<'jogar' | 'explorar'>('jogar')
  const [state, dispatch] = useReducer(gameReducer, initialState)
  const [sceneKm, setSceneKm] = useState(0)
  const interpretation = state.interpretation
  const onMap = interpretation !== null && interpretation.scene === 'mapa'
  const targetHops = onMap ? Math.min(kmToSquares(interpretation.km), PATH_END_HOPS) : 0

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

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <div>
            <h1 className="brand-title">A viagem do Pingo</h1>
            <p className="brand-subtitle">Da Patagônia até Santa Catarina</p>
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
          <MapBoard hops={hops} traveling={state.phase === 'mapa'} mood={mood} celebrating={won} hidden={showScene} />

          {showScene && interpretation && (
            <div className="scene-layer" key={state.tripId}>
              {interpretation.scene === 'espaco' && (
                <SpaceScene interpretation={interpretation} animate onProgress={setSceneKm} onDone={sceneDone} />
              )}
              {interpretation.scene !== 'espaco' && (
                <GlobeScene interpretation={interpretation} animate onProgress={setSceneKm} onDone={sceneDone} />
              )}
            </div>
          )}

          {won && <Confetti />}
          {won && !state.postcardOpen && <div className="win-banner" data-testid="parabens">Parabéns!</div>}

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
          key={state.gameId}
          traveling={traveling}
          locked={won}
          odometerKm={odometerKm}
          onSwim={(km) => dispatch({ type: 'nadar', km })}
          onRestart={restart}
        />
      </main>
      )}
    </div>
  )
}
