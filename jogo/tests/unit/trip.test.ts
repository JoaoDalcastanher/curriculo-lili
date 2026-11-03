import { describe, expect, test } from 'bun:test'
import { interpret } from '../../src/game/interpreter'
import { STOPS } from '../../src/game/stops'
import { buildTrip, squaresBetween, staircase } from '../../src/game/trip'

describe('saída e chegada livres', () => {
  test('Patagônia ↔ Santa Catarina usa o percurso da atividade: 21 quadradinhos', () => {
    expect(buildTrip('patagonia', 'santa-catarina')).toMatchObject({ classic: 'ida', squares: 21, answerKm: 3150 })
    expect(buildTrip('santa-catarina', 'patagonia')).toMatchObject({ classic: 'volta', squares: 21, answerKm: 3150 })
  })

  test('qualquer par de lugares da Terra tem caminho, com pelo menos 1 quadradinho', () => {
    for (const from of STOPS) {
      for (const to of STOPS) {
        if (from.id !== to.id) {
          expect(squaresBetween(from.id, to.id)).toBeGreaterThanOrEqual(1)
        }
      }
    }
  })

  test('ida e volta têm o mesmo número de quadradinhos', () => {
    for (const [a, b] of [['patagonia', 'malvinas'], ['malvinas', 'toquio'], ['caminho-30', 'nova-york'], ['santa-catarina', 'lagos']]) {
      expect(squaresBetween(a, b)).toBe(squaresBetween(b, a))
    }
  })

  test('o caminho anda só de quadradinho em quadradinho, sem voltar por onde passou', () => {
    for (const [a, b] of [['patagonia', 'malvinas'], ['malvinas', 'toquio'], ['patagonia', 'polo-norte']]) {
      const trip = buildTrip(a, b)
      trip.cells.slice(1).forEach((cell, index) => {
        const previous = trip.cells[index]
        expect(Math.abs(cell.x - previous.x) + Math.abs(cell.y - previous.y)).toBe(1)
      })
      expect(new Set(trip.cells.map((cell) => `${cell.x},${cell.y}`)).size).toBe(trip.cells.length)
      expect(trip.answerKm).toBe(trip.squares * 150)
    }
  })

  test('degraus seguem a linha (horizontal e vertical)', () => {
    const cells = staircase([{ x: 0.5, y: 0.5 }, { x: 3.5, y: 2.5 }])
    expect(cells.length - 1).toBe(5)
    expect(cells.at(-1)).toEqual({ x: 3.5, y: 2.5 })
  })

  test('Patagônia → Ilhas Malvinas é pertinho', () => {
    const trip = buildTrip('patagonia', 'malvinas')
    expect(trip.squares).toBeGreaterThan(5)
    expect(trip.squares).toBeLessThan(20)
  })

  test('acerto em outra rota: Parabéns genérico com o selo da chegada', () => {
    const trip = buildTrip('patagonia', 'malvinas')
    const result = interpret(trip.answerKm, trip)
    expect(result).toMatchObject({ kind: 'acerto', place: 'Ilhas Malvinas, Atlântico Sul', sceneId: 'malvinas' })
    expect(result.text).toBe(`O Pingo saiu da Patagônia e chegou nas Ilhas Malvinas! O caminho tem ${trip.squares} quadradinhos de 150 km.`)
    expect(result.facts[0].value).toBe(`${trip.squares} × 150 km = ${new Intl.NumberFormat('pt-BR').format(trip.answerKm)} km`)
  })

  test('em rotas sem o mapa da atividade, quem para no meio do caminho não ganha nome de quadradinho', () => {
    const trip = buildTrip('patagonia', 'malvinas')
    expect(interpret(150, trip)).toMatchObject({ kind: 'curto', place: 'Meio do caminho' })
  })
})

describe('preposições dos lugares', () => {
  test('da, das, do, de; na, nas, no, em; até a, até as, até o', async () => {
    const { fromPlace, inPlace, untilPlace } = await import('../../src/game/format')
    expect(fromPlace('Patagônia')).toBe('da Patagônia')
    expect(fromPlace('Ilhas Malvinas')).toBe('das Ilhas Malvinas')
    expect(fromPlace('Rio de Janeiro')).toBe('do Rio de Janeiro')
    expect(fromPlace('Lagos')).toBe('de Lagos')
    expect(inPlace('Ilhas Malvinas')).toBe('nas Ilhas Malvinas')
    expect(inPlace('Santa Catarina')).toBe('em Santa Catarina')
    expect(untilPlace('Patagônia')).toBe('até a Patagônia')
    expect(untilPlace('Rio de Janeiro')).toBe('até o Rio de Janeiro')
  })
})
