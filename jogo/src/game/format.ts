const integer = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 })
const oneDecimal = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 })
const compact = new Intl.NumberFormat('pt-BR', { notation: 'compact', compactDisplay: 'long', maximumFractionDigits: 1 })

export const MAX_KM = 1_000_000_000_000_000

/** Números grandes viram "1,3 milhão", "40 trilhões"… */
export function formatNumber(value: number): string {
  if (value >= 1_000_000) {
    return compact.format(value)
  }
  if (value >= 100 || Number.isInteger(value)) {
    return integer.format(Math.round(value))
  }
  return oneDecimal.format(value)
}

/** "de" antes da unidade quando o número vira palavra: "2 milhões de km". */
function withUnit(value: number, unit: string): string {
  return `${formatNumber(value)} ${value >= 1_000_000 ? 'de ' : ''}${unit}`
}

export function formatKm(km: number): string {
  return withUnit(km, 'km')
}

export function formatSquares(squares: number): string {
  const rounded = squares >= 100 ? Math.round(squares) : Math.round(squares * 10) / 10
  return withUnit(rounded, rounded === 1 ? 'quadradinho' : 'quadradinhos')
}

export function formatLaps(laps: number): string {
  const rounded = laps >= 100 ? Math.round(laps) : Math.round(laps * 10) / 10
  return withUnit(rounded, rounded >= 2 ? 'voltas' : 'volta')
}

/**
 * Lê o que a criança digitou. Aceita "3150", "3.150", "3 150 km" e "3150,5".
 * Retorna null quando não dá para entender como uma distância.
 */
export function parseKm(raw: string): number | null {
  const cleaned = raw.toLowerCase().replace(/km/g, '').replace(/\s+/g, '')
  if (cleaned === '') {
    return null
  }

  const thousandsOnly = /^\d{1,3}(\.\d{3})+$/.test(cleaned)
  const normalized = cleaned.includes(',') || thousandsOnly
    ? cleaned.replace(/\./g, '').replace(',', '.')
    : cleaned

  if (!/^\d+(\.\d+)?$/.test(normalized)) {
    return null
  }

  const value = Number(normalized)
  if (!Number.isFinite(value) || value <= 0) {
    return null
  }
  return value
}
