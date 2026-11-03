import { useEffect, useRef } from 'react'
import { KM_PER_CELL } from '../game/config'
import { formatKm, fromPlace, untilPlace } from '../game/format'
import type { Trip } from '../game/trip'
import { PostcardStamp } from './PostcardStamp'

type DeparturePostcardProps = {
  trip: Trip
  onGo: () => void
}

/** O cartão de partida: o mesmo texto para qualquer viagem, com o selo do lugar de saída. */
export function DeparturePostcard({ trip, onGo }: DeparturePostcardProps) {
  const goRef = useRef<HTMLButtonElement>(null)
  const { from, to } = trip

  useEffect(() => {
    goRef.current?.focus({ preventScroll: true })
  }, [trip])

  return (
    <div className="postcard-backdrop" data-testid="partida">
      <article className="postcard" role="dialog" aria-modal="true" aria-labelledby="partida-titulo">
        <PostcardStamp mood={from.mood} sceneId={from.sceneId} tone="is-world" />
        <div className="postcard-body">
          <p className="postcard-kicker">Cartão-postal {fromPlace(from.name)}</p>
          <h2 id="partida-titulo" className="postcard-title">Partindo {fromPlace(from.name)}!</h2>
          <p className="postcard-text">
            O Pingo vai nadar {fromPlace(from.name)} {untilPlace(to.name)}. Conte os quadradinhos do caminho no mapa,
            use a escala e descubra quantos quilômetros ele vai nadar.
          </p>
          <dl className="postcard-facts">
            <div>
              <dt>Saída</dt>
              <dd>{from.name}</dd>
            </div>
            <div>
              <dt>Chegada</dt>
              <dd>{to.name}</dd>
            </div>
            <div>
              <dt>Escala</dt>
              <dd>1 quadradinho = {formatKm(KM_PER_CELL)}</dd>
            </div>
          </dl>
          <div className="postcard-actions">
            <button ref={goRef} type="button" className="button is-primary" onClick={onGo} data-testid="vamos">Vamos lá!</button>
          </div>
        </div>
      </article>
    </div>
  )
}
