import { describe, expect, test } from 'bun:test'
import { GOAL_HOPS, ROUTE_MOVES, SOUTH_AMERICA, AFRICA } from '../../src/game/config'
import { formatKm, formatSquares, parseKm } from '../../src/game/format'
import { interpret, REACHED_DESTINATIONS, WORLD_LIMIT_KM } from '../../src/game/interpreter'
import { ANSWER_KM, cellName, PATH, PATH_END_KM, positionAtHops } from '../../src/game/route'
import type { GridPoint } from '../../src/game/types'

function inside(point: GridPoint, polygon: readonly GridPoint[]): boolean {
  let result = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i]
    const b = polygon[j]
    const crosses = (a.y > point.y) !== (b.y > point.y)
      && point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x
    result = crosses ? !result : result
  }
  return result
}

describe('percurso na malha', () => {
  test('só anda de quadradinho em quadradinho (horizontal ou vertical)', () => {
    PATH.slice(1).forEach((point, index) => {
      const previous = PATH[index]
      expect(Math.abs(point.x - previous.x) + Math.abs(point.y - previous.y)).toBe(1)
    })
  })

  test('sai de C3 e chega em L15 com 21 quadradinhos = 3.150 km', () => {
    expect(cellName(PATH[0])).toBe('C3')
    expect(cellName(PATH[GOAL_HOPS])).toBe('L15')
    expect(ANSWER_KM).toBe(3150)
  })

  test('nada sempre pelo mar (a chegada é na praia)', () => {
    const onLand = PATH.filter((point, index) => index !== GOAL_HOPS && (inside(point, SOUTH_AMERICA) || inside(point, AFRICA)))
    expect(onLand).toEqual([])
  })

  test('o percurso completo vai até a África', () => {
    expect(ROUTE_MOVES.length).toBe(79)
    expect(PATH_END_KM).toBe(11_850)
  })

  test('150 km andam exatamente 1 quadradinho', () => {
    expect(positionAtHops(1)).toMatchObject({ x: 3.5, y: 2.5 })
    expect(positionAtHops(0.5)).toMatchObject({ x: 3, y: 2.5 })
  })
})

describe('leitura da distância', () => {
  test.each([
    ['3150', 3150],
    ['3.150', 3150],
    ['3 150 km', 3150],
    ['3150,5', 3150.5],
    ['2.5', 2.5],
  ])('%s → %d', (raw, expected) => {
    expect(parseKm(raw)).toBe(expected)
  })

  test.each(['', 'abc', '-10', '0', '1e5'])('rejeita "%s"', (raw) => {
    expect(parseKm(raw)).toBeNull()
  })

  test('números grandes ficam legíveis', () => {
    expect(formatKm(200_000_000)).toBe('200 milhões de km')
    expect(formatSquares(21)).toBe('21 quadradinhos')
    expect(formatSquares(1)).toBe('1 quadradinho')
  })
})

describe('interpretador', () => {
  test('acerto só com a distância exata', () => {
    expect(interpret(3150).kind).toBe('acerto')
    expect(interpret(3149).kind).toBe('quase-curto')
    expect(interpret(1000)).toMatchObject({ kind: 'curto', place: 'Quadradinho G6' })
    expect(interpret(3300)).toMatchObject({ kind: 'quase-longe', place: 'Litoral do Paraná' })
  })

  test('não revela a resposta quando erra', () => {
    for (const km of [600, 3000, 3300, 5000]) {
      expect(JSON.stringify(interpret(km))).not.toContain('3.150')
    }
  })

  test('segue a costa: Rio, Bahia, Equador, África', () => {
    expect(interpret(4500).place).toBe('Rio de Janeiro')
    expect(interpret(6000).place).toBe('Salvador, Bahia')
    expect(interpret(7800).place).toBe('Linha do Equador')
    expect(interpret(11_850).place).toBe('Gabão, África')
  })

  test('qualquer distância maior que 3.150 km começa no globo', () => {
    for (const km of [3151, 3300, 4500, 6000, 11_850, 22_000]) {
      expect(interpret(km).scene).not.toBe('mapa')
    }
    expect(interpret(3300).scene).toBe('mundo')
    expect(interpret(6000)).toMatchObject({ scene: 'mundo', sceneId: undefined, place: 'Salvador, Bahia' })
    expect(interpret(11_850)).toMatchObject({ scene: 'mundo', sceneId: 'gabao' })
    expect(interpret(3149).scene).toBe('mapa')
  })

  test('depois da África, "poderia chegar até…"', () => {
    const result = interpret(22_000)
    expect(result.scene).toBe('mundo')
    expect(result.destination?.km).toBeLessThanOrEqual(22_000)
    expect(result.reachable.length).toBeGreaterThan(3)
    expect(REACHED_DESTINATIONS.length).toBeGreaterThanOrEqual(25)
  })

  test('depois do último destino, vira voltas na Terra', () => {
    expect(interpret(WORLD_LIMIT_KM + 1).scene).toBe('voltas')
    const result = interpret(200_375)
    expect(result.scene).toBe('voltas')
    expect(result.laps).toBeCloseTo(5)
    expect(result.title).toBe('Daria 5 voltas na Terra!')
  })

  test('muito longe, vai para o espaço', () => {
    expect(interpret(400_000).body?.id).toBe('lua')
    expect(interpret(200_000_000).body?.id).toBe('sol')
    expect(interpret(5e13).body?.id).toBe('proxima')
  })
})

describe('rota pelo mar', () => {
  test('todo trecho de oceano fica na água (fora os canais estreitos)', async () => {
    const { geoContains, geoInterpolate } = await import('d3-geo')
    const { LAND } = await import('../../src/game/world')
    const { NARROW_EDGES, SEA_EDGES, SEA_NODES } = await import('../../src/game/sea')
    const narrow = new Set(NARROW_EDGES.map(([a, b]) => `${a}-${b}`))
    const crossing = SEA_EDGES.filter(([a, b]) => {
      if (narrow.has(`${a}-${b}`)) {
        return false
      }
      const line = geoInterpolate([SEA_NODES[a].lon, SEA_NODES[a].lat], [SEA_NODES[b].lon, SEA_NODES[b].lat])
      return Array.from({ length: 39 }, (_, step) => line((step + 1) / 40)).some((point) => geoContains(LAND, point))
    })
    expect(crossing).toEqual([])
  })

  test('todo destino tem caminho pelo mar e a distância passa da África', async () => {
    const { DESTINATIONS } = await import('../../src/game/destinations')
    const { seaRoute } = await import('../../src/game/sea')
    for (const destination of DESTINATIONS) {
      const route = seaRoute(destination.id, destination.at)
      expect(route.seaKm).toBeGreaterThanOrEqual(0)
      expect(Number.isFinite(route.seaKm)).toBe(true)
    }
    for (const reached of REACHED_DESTINATIONS) {
      expect(reached.km).toBeGreaterThan(PATH_END_KM)
    }
  })

  test('a viagem completa começa na Patagônia e termina no destino', async () => {
    const { journeyTo, pointAtKm } = await import('../../src/game/journey')
    const tokyo = REACHED_DESTINATIONS.find((item) => item.id === 'toquio')
    expect(tokyo).toBeDefined()
    if (!tokyo) {
      return
    }
    const journey = journeyTo(tokyo.id, tokyo.at)
    expect(journey.totalKm).toBeCloseTo(tokyo.km, 0)
    const end = pointAtKm(journey, journey.totalKm)
    expect(end.lat).toBeCloseTo(tokyo.at.lat, 3)
    expect(end.lon).toBeCloseTo(tokyo.at.lon, 3)
  })
})

describe('explorar', () => {
  test('tem o caminho, o mundo e o espaço', async () => {
    const { EARTH_PLACES, SPACE_PLACES } = await import('../../src/game/places')
    expect(EARTH_PLACES[0].id).toBe('patagonia')
    expect(EARTH_PLACES.some((place) => place.id === 'santa-catarina' && place.km === 3150)).toBe(true)
    expect(EARTH_PLACES.filter((place) => place.group === 'mundo').length).toBe(REACHED_DESTINATIONS.length)
    expect(SPACE_PLACES.map((place) => place.id)).toContain('lua')
  })
})
