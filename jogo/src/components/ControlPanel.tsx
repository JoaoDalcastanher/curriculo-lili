import { useState, type FormEvent } from 'react'
import { formatKm, formatSquares, MAX_KM, parseKm } from '../game/format'
import { kmToSquares } from '../game/route'

type ControlPanelProps = {
  traveling: boolean
  locked: boolean
  odometerKm: number
  onSwim: (km: number) => void
  onRestart: () => void
}

export function ControlPanel({ traveling, locked, odometerKm, onSwim, onRestart }: ControlPanelProps) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const km = parseKm(value)
    if (km === null) {
      setError('Digite só números, tipo 1200.')
      return
    }
    if (km > MAX_KM) {
      setError('Esse número é grande demais até para o Pingo.')
      return
    }
    setError(null)
    onSwim(km)
  }

  return (
    <aside className="panel" aria-label="Painel da missão" data-testid="painel">
      <p className="panel-kicker">Missão</p>
      <h2 className="panel-title">Quantos quilômetros o Pingo vai nadar?</h2>

      <form className="swim-form" onSubmit={submit} noValidate>
        <label className="swim-label" htmlFor="km">Distância</label>
        <div className={error ? 'swim-field has-error' : 'swim-field'}>
          <input
            id="km"
            name="km"
            inputMode="decimal"
            autoComplete="off"
            placeholder="0"
            value={value}
            disabled={traveling || locked}
            onChange={(event) => setValue(event.target.value)}
            aria-describedby={error ? 'km-erro' : undefined}
            aria-invalid={error ? true : undefined}
            data-testid="campo-km"
          />
          <span className="swim-unit">km</span>
          <button type="submit" className="button is-primary swim-button" disabled={traveling || locked} data-testid="nadar">
            {traveling ? 'Nadando…' : 'Nadar'}
          </button>
        </div>
        {error && <p id="km-erro" className="swim-error" role="alert">{error}</p>}
      </form>

      <div className={traveling ? 'odometer is-on' : 'odometer'} aria-hidden={!traveling} data-testid="hodometro">
        <span className="odometer-squares">{formatSquares(kmToSquares(odometerKm))}</span>
        <span className="odometer-km">{formatKm(odometerKm)}</span>
      </div>

      <footer className="panel-foot">
        <button type="button" className="button is-ghost" onClick={onRestart} data-testid="recomecar">Recomeçar</button>
      </footer>
    </aside>
  )
}
