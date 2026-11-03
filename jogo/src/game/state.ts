import { interpret } from './interpreter'
import type { Interpretation } from './types'

/**
 * pronto → mapa (Pingo nadando na malha) → cena (globo ou espaço, se for longe)
 * → resultado (cartão-postal).
 */
export type Phase = 'pronto' | 'mapa' | 'cena' | 'resultado'

export type GameState = {
  phase: Phase
  tripId: number
  interpretation: Interpretation | null
  postcardOpen: boolean
  /** Muda a cada recomeço, para limpar o painel. */
  gameId: number
}

export type GameAction =
  | { type: 'nadar'; km: number }
  | { type: 'mapa-fim' }
  | { type: 'cena-fim' }
  | { type: 'abrir-postal' }
  | { type: 'ver-mapa' }
  | { type: 'tentar-de-novo' }
  | { type: 'recomecar' }

export const initialState: GameState = {
  phase: 'pronto',
  tripId: 0,
  interpretation: null,
  postcardOpen: false,
  gameId: 0,
}

export function isTraveling(state: GameState): boolean {
  return state.phase === 'mapa' || state.phase === 'cena'
}

export function hasWon(state: GameState): boolean {
  return state.phase === 'resultado' && state.interpretation?.kind === 'acerto'
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'nadar': {
      if (isTraveling(state) || hasWon(state)) {
        return state
      }
      const interpretation = interpret(action.km)
      const phase: Phase = interpretation.scene === 'mapa' ? 'mapa' : 'cena'
      return { ...state, phase, tripId: state.tripId + 1, interpretation, postcardOpen: false }
    }
    case 'mapa-fim': {
      if (state.phase !== 'mapa' || !state.interpretation) {
        return state
      }
      return { ...state, phase: state.interpretation.scene === 'mapa' ? 'resultado' : 'cena' }
    }
    case 'cena-fim': {
      return state.phase === 'cena' ? { ...state, phase: 'resultado' } : state
    }
    case 'abrir-postal': {
      return state.phase === 'resultado' ? { ...state, postcardOpen: true } : state
    }
    case 'ver-mapa': {
      return { ...state, postcardOpen: false }
    }
    case 'tentar-de-novo': {
      return { ...state, phase: 'pronto', interpretation: null, postcardOpen: false, tripId: state.tripId + 1 }
    }
    case 'recomecar': {
      return { ...initialState, gameId: state.gameId + 1, tripId: state.tripId + 1 }
    }
  }
}
