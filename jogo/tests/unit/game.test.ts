import { describe, expect, test } from 'bun:test'
import { GOAL_HOPS, ROUTE_MOVES, SOUTH_AMERICA, AFRICA } from '../../src/game/config'
import { formatKm, formatSquares, parseKm } from '../../src/game/format'
import { interpret, worldLimitKm } from '../../src/game/interpreter'
import { buildTrip, onwardFrom } from '../../src/game/trip'
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

const CLASSIC = buildTrip('patagonia', 'santa-catarina')
const at = (km: number) => interpret(km, CLASSIC)

describe('interpretador (Patagônia → Santa Catarina)', () => {
  test('acerto só com a distância exata', () => {
    expect(at(3150).kind).toBe('acerto')
    expect(at(3149).kind).toBe('quase-curto')
    expect(at(1000)).toMatchObject({ kind: 'curto', place: 'Quadradinho G6' })
    expect(at(3300)).toMatchObject({ kind: 'quase-longe', scene: 'mundo' })
  })

  test('o Parabéns é genérico: saída, chegada e a conta', () => {
    const result = at(3150)
    expect(result.title).toBe('Parabéns! Na mosca!')
    expect(result.text).toBe('O Pingo saiu da Patagônia e chegou em Santa Catarina! O caminho tem 21 quadradinhos de 150 km.')
    expect(result.sceneId).toBe('santa-catarina')
  })

  test('não revela a resposta quando erra', () => {
    for (const km of [600, 3000, 3300, 5000]) {
      expect(JSON.stringify(at(km))).not.toContain('3.150')
    }
  })

  test('qualquer distância maior que a chegada vai para o globo', () => {
    for (const km of [3151, 3300, 4500, 6000, 22_000]) {
      expect(at(km).scene).not.toBe('mapa')
    }
    expect(at(3149).scene).toBe('mapa')
  })

  test('passou do ponto: os lugares do mundo ficam na distância proporcional', () => {
    const onward = onwardFrom(CLASSIC)
    const rio = onward.find((item) => item.stop.name === 'Rio de Janeiro')
    expect(rio).toBeDefined()
    if (!rio) {
      return
    }
    expect(rio.km).toBeGreaterThan(3150)
    expect(at(rio.km)).toMatchObject({ kind: 'mundo', place: 'Rio de Janeiro, Brasil' })
    expect(at(22_000).reachable.length).toBeGreaterThan(3)
  })

  test('depois do último lugar, vira voltas na Terra', () => {
    expect(at(worldLimitKm(CLASSIC) + 1).scene).toBe('voltas')
    const result = at(200_375)
    expect(result.scene).toBe('voltas')
    expect(result.laps).toBeCloseTo(5)
    expect(result.title).toBe('Daria 5 voltas na Terra!')
  })

  test('muito longe, vai para o espaço', () => {
    expect(at(400_000).body?.id).toBe('lua')
    expect(at(200_000_000).body?.id).toBe('sol')
    expect(at(5e13).body?.id).toBe('proxima')
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

})

describe('explorar', () => {
  test('tem o caminho, o mundo e o espaço', async () => {
    const { EARTH_PLACES, SPACE_PLACES } = await import('../../src/game/places')
    expect(EARTH_PLACES[0].id).toBe('patagonia')
    expect(EARTH_PLACES.some((place) => place.id === 'santa-catarina' && place.km === 3150)).toBe(true)
    expect(EARTH_PLACES.some((place) => place.id === 'malvinas' && place.sceneId === 'malvinas')).toBe(true)
    expect(SPACE_PLACES.map((place) => place.id)).toContain('lua')
  })
})
