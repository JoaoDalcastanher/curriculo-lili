import type { LatLon } from './types'

/** Raio médio da Terra. */
export const EARTH_RADIUS_KM = 6_371

/** Uma volta na Terra pelo Equador. */
export const EARTH_CIRCUMFERENCE_KM = 40_075

const toRadians = (degrees: number) => (degrees * Math.PI) / 180

/** Distância pela superfície da Terra entre dois pontos (fórmula de haversine). */
export function greatCircleKm(from: LatLon, to: LatLon): number {
  const dLat = toRadians(to.lat - from.lat)
  const dLon = toRadians(to.lon - from.lon)
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRadians(from.lat)) * Math.cos(toRadians(to.lat)) * Math.sin(dLon / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)))
}
