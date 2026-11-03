import { useState, type FormEvent } from 'react'
import { formatKm, formatSquares, MAX_KM, parseKm } from '../game/format'
import { kmToSquares } from '../game/route'
import { STOPS } from '../game/stops'
import type { Stop } from '../game/types'

type ControlPanelProps = {
  fromId: string
  toId: string
  onRoute: (fromId: string, toId: string) => void
  traveling: boolean
  locked: boolean
  odometerKm: number
  onSwim: (km: number) => void
  onRestart: () => void
}

export function ControlPanel({ fromId, toId, onRoute, traveling, locked, odometerKm, onSwim, onRestart }: ControlPanelProps) {
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

      <div className="route-pick" role="group" aria-label="Para onde o Pingo vai">
        <StopSelect id="saida" label="Saída" value={fromId} other={toId} disabled={traveling} onChange={(id) => onRoute(id, toId)} />
        <button
          type="button"
          className="route-swap"
          onClick={() => onRoute(toId, fromId)}
          disabled={traveling}
          aria-label="Trocar saída e chegada"
          title="Trocar saída e chegada"
          data-testid="trocar"
        >
          ⇄
        </button>
        <StopSelect id="chegada" label="Chegada" value={toId} other={fromId} disabled={traveling} onChange={(id) => onRoute(fromId, id)} />
      </div>

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

const GROUPS: readonly { id: Stop['group']; label: string }[] = [
  { id: 'caminho', label: 'No caminho' },
  { id: 'mundo', label: 'Pelo mundo' },
]

type StopSelectProps = {
  id: string
  label: string
  value: string
  /** O lugar escolhido no outro campo (não dá para sair e chegar no mesmo lugar). */
  other: string
  disabled: boolean
  onChange: (id: string) => void
}

function StopSelect({ id, label, value, other, disabled, onChange }: StopSelectProps) {
  return (
    <label className="route-field" htmlFor={id}>
      <span className="route-label">{label}</span>
      <select id={id} value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} data-testid={id}>
        {GROUPS.map((group) => (
          <optgroup key={group.id} label={group.label}>
            {STOPS.filter((stop) => stop.group === group.id).map((stop) => (
              <option key={stop.id} value={stop.id} disabled={stop.id === other}>{stop.name}</option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  )
}
