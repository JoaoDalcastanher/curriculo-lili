import { useEffect, useRef, useState } from 'react'
import { GOAL_HOPS } from '../game/config'

const MS_PER_HOP_NEAR = 400
const MS_PER_HOP_FAR = 170
const MIN_DURATION = 900
const REDUCED_DURATION = 250

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** No mapa da atividade ele nada no ritmo de um quadradinho por vez. */
export function travelDuration(hops: number): number {
  if (prefersReducedMotion()) {
    return REDUCED_DURATION
  }
  const near = Math.min(hops, GOAL_HOPS) * MS_PER_HOP_NEAR
  const far = Math.max(0, hops - GOAL_HOPS) * MS_PER_HOP_FAR
  return Math.max(MIN_DURATION, near + far)
}

/** O cartão-postal abre assim que a animação termina, sem espera. */
export function postcardDelay(): number {
  return 0
}

/**
 * Anima o Pingo pela malha até `targetHops`. Cada `tripId` novo recomeça do zero.
 * Com `active` falso ele volta para o início, sem animar.
 */
export function useTravel(tripId: number, targetHops: number, active: boolean, onArrive: () => void): number {
  const [hops, setHops] = useState(0)
  const arriveRef = useRef(onArrive)
  arriveRef.current = onArrive

  useEffect(() => {
    if (!active) {
      setHops(0)
      return
    }

    const duration = travelDuration(targetHops)
    const startedAt = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration)
      setHops(targetHops * easeInOut(progress))
      if (progress < 1) {
        frame = requestAnimationFrame(tick)
        return
      }
      arriveRef.current()
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [tripId, targetHops, active])

  return hops
}
