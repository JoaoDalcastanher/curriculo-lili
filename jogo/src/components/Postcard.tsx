import { useEffect, useRef } from 'react'
import type { Interpretation } from '../game/types'
import { PostcardStamp } from './PostcardStamp'

type PostcardProps = {
  interpretation: Interpretation
  onLook: () => void
  onRetry: () => void
  onRestart: () => void
}

const STAMP_CLASS: Record<Interpretation['scene'], string> = {
  mapa: 'is-sea',
  mundo: 'is-world',
  voltas: 'is-world',
  espaco: 'is-space',
}

const LOOK_LABEL: Record<Interpretation['scene'], string> = {
  mapa: 'Ver o mapa',
  mundo: 'Ver o globo',
  voltas: 'Ver as voltas',
  espaco: 'Ver o espaço',
}

const FEMININE = ['Linha', 'Volta', 'Lua', 'Cidade', 'Muralha']
const MASCULINE = ['Quadradinho', 'Rio', 'Gabão', 'Egito', 'Meio', 'Litoral', 'Sol', 'Mar', 'Polo', 'Deserto', 'Monte', 'Havaí']

/** "do Quadradinho G6", "da Linha do Equador", "de Natal". */
function prepositionFor(place: string): string {
  const first = place.split(' ')[0]
  if (FEMININE.includes(first)) {
    return 'da'
  }
  return MASCULINE.includes(first) ? 'do' : 'de'
}

/** O mesmo cartão-postal para qualquer resposta: certa, curta, longa ou absurda. */
export function Postcard({ interpretation, onLook, onRetry, onRestart }: PostcardProps) {
  const won = interpretation.kind === 'acerto'
  const actionRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    actionRef.current?.focus()
  }, [interpretation])

  const sceneId = interpretation.sceneId ?? interpretation.destination?.id ?? interpretation.body?.id

  return (
    <div className="postcard-backdrop" data-testid="postal" data-kind={interpretation.kind}>
      <article className="postcard" role="dialog" aria-modal="true" aria-labelledby="postcard-title">
        <PostcardStamp
          mood={interpretation.mood}
          sceneId={sceneId}
          tone={won ? 'is-win' : STAMP_CLASS[interpretation.scene]}
          far={interpretation.kind === 'curto'}
          label={won ? 'Parabéns!' : undefined}
        />

        <div className="postcard-body">
          <p className="postcard-kicker">
            Cartão-postal {prepositionFor(interpretation.place)} <span data-testid="lugar">{interpretation.place}</span>
          </p>
          <h2 id="postcard-title" className="postcard-title">{interpretation.title}</h2>
          <p className="postcard-text">{interpretation.text}</p>

          <dl className="postcard-facts">
            {interpretation.facts.map((fact) => (
              <div key={fact.label} className={fact.label === 'A conta' ? 'is-math' : undefined}>
                <dt>{fact.label}</dt>
                <dd data-testid={fact.label === 'A conta' ? 'conta' : undefined}>{fact.value}</dd>
              </div>
            ))}
          </dl>

          {interpretation.reachable.length > 0 && (
            <div className="postcard-reach">
              <p className="postcard-reach-label">Poderia chegar até</p>
              <ul className="postcard-reach-list" data-testid="alcance">
                {interpretation.reachable.map((name) => <li key={name}>{name}</li>)}
              </ul>
            </div>
          )}

          <div className="postcard-actions">
            {won && (
              <button ref={actionRef} type="button" className="button is-primary" onClick={onRestart}>Jogar de novo</button>
            )}
            {!won && (
              <button ref={actionRef} type="button" className="button is-primary" onClick={onRetry}>Tentar de novo</button>
            )}
            <button type="button" className="button is-ghost" onClick={onLook}>{LOOK_LABEL[interpretation.scene]}</button>
          </div>
        </div>
      </article>
    </div>
  )
}
