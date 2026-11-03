import { geoInterpolate } from 'd3-geo'
import { KM_PER_CELL } from './config'
import { greatCircleKm } from './geo'
import { gridToLatLon, PATH, PATH_END_KM } from './route'
import { seaRoute } from './sea'
import { onwardFrom, routeKm, seaRouteBetween, type Trip } from './trip'
import type { Interpretation, LatLon } from './types'

/** Uma viagem completa: Patagônia → malha até a África → mar → destino. */
export type Journey = {
  points: LatLon[]
  /** Quilômetro em que o Pingo passa por cada ponto. */
  kmAt: number[]
  totalKm: number
}

const MAP_POINTS: LatLon[] = PATH.map(gridToLatLon)
const MAP_KM: number[] = PATH.map((_, index) => index * KM_PER_CELL)

/** Caminho só pela malha, até a chegada na África. */
export const MAP_JOURNEY: Journey = { points: MAP_POINTS, kmAt: MAP_KM, totalKm: PATH_END_KM }

export function journeyTo(destinationId: string, at: LatLon): Journey {
  const route = seaRoute(destinationId, at)
  const points = [...MAP_POINTS]
  const kmAt = [...MAP_KM]
  route.points.slice(1).forEach((point, index) => {
    const previous = route.points[index]
    kmAt.push(kmAt[kmAt.length - 1] + greatCircleKm(previous, point))
    points.push(point)
  })
  return { points, kmAt, totalKm: kmAt[kmAt.length - 1] }
}

/** Onde o Pingo está depois de nadar `km` nesta viagem. */
export function pointAtKm(journey: Journey, km: number): LatLon {
  const clamped = Math.max(0, Math.min(km, journey.totalKm))
  const index = Math.max(0, journey.kmAt.findIndex((value) => value >= clamped) - 1)
  const start = journey.kmAt[index]
  const end = journey.kmAt[index + 1] ?? start
  const fraction = end > start ? (clamped - start) / (end - start) : 0
  const from = journey.points[index]
  const to = journey.points[index + 1] ?? from
  const [lon, lat] = geoInterpolate([from.lon, from.lat], [to.lon, to.lat])(fraction)
  return { lat, lon }
}

/** Pontos já percorridos (para desenhar o rastro). */
export function traveledPoints(journey: Journey, km: number): LatLon[] {
  const passed = journey.points.filter((_, index) => journey.kmAt[index] <= km)
  return [...passed, pointAtKm(journey, km)]
}

type Leg = { route: readonly LatLon[]; km: number }

/** Junta trechos do globo; cada trecho é esticado para ter a distância da escala. */
function joinLegs(legs: readonly Leg[]): Journey {
  const points: LatLon[] = []
  const kmAt: number[] = []
  let base = 0
  for (const leg of legs) {
    const real = routeKm(leg.route) || 1
    let walked = 0
    leg.route.forEach((point, index) => {
      if (index > 0) {
        walked += greatCircleKm(leg.route[index - 1], point)
      }
      if (index === 0 && points.length > 0) {
        return
      }
      points.push(point)
      kmAt.push(base + (walked / real) * leg.km)
    })
    base += leg.km
  }
  return { points, kmAt, totalKm: base }
}

/**
 * A viagem no globo: da saída até a chegada e, se passou do ponto, da chegada
 * até o lugar alcançado (ou até o próximo lugar, se ainda não chegou em nenhum).
 */
export function journeyFor(trip: Trip, interpretation: Interpretation): Journey {
  const legs: Leg[] = [{ route: trip.route, km: trip.answerKm }]
  const target = interpretation.destination ?? onwardFrom(trip)[0]?.stop
  const targetKm = interpretation.destination?.km ?? onwardFrom(trip)[0]?.km
  if (target && targetKm !== undefined && interpretation.km > trip.answerKm) {
    legs.push({ route: seaRouteBetween(trip.to, target), km: targetKm - trip.answerKm })
  }
  return joinLegs(legs)
}
