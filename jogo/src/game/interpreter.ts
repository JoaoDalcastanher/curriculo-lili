import { KM_PER_CELL } from './config'
import { SPACE_BODIES } from './destinations'
import { formatKm, formatLaps, formatNumber, formatSquares, fromPlace, inPlace } from './format'
import { EARTH_CIRCUMFERENCE_KM } from './geo'
import { cellName, kmToSquares } from './route'
import { onwardFrom, type Onward, type Trip } from './trip'
import type { Fact, Interpretation, ReachedDestination, SpaceBody } from './types'

/**
 * O interpretador transforma uma distância numa viagem de `trip.from` até
 * `trip.to`: onde o Pingo para, o que ele "poderia alcançar" se passar do
 * ponto, quantas voltas na Terra daria, e assim por diante. Tudo medido em
 * quadradinhos de 150 km — a escala é lei.
 */

const MOON_KM = SPACE_BODIES[0].km
const LAP_SQUARES = EARTH_CIRCUMFERENCE_KM / KM_PER_CELL

const swum = (km: number): Fact => ({ label: 'Ele nadou', value: formatSquares(kmToSquares(km)) })
const inKm = (km: number): Fact => ({ label: 'Em quilômetros', value: formatKm(km) })
/** "Salvador, Bahia" já diz onde fica; os outros ganham a região: "Lagos, Nigéria". */
const placeName = (stop: Trip['to']) => (stop.name.includes(',') ? stop.name : `${stop.name}, ${stop.region}`)

const reachedOf = (onward: Onward): ReachedDestination => ({ ...onward.stop, km: onward.km, squares: onward.squares })

function interpretGoal(km: number, trip: Trip): Interpretation {
  return {
    kind: 'acerto',
    scene: 'mapa',
    km,
    squares: trip.squares,
    place: placeName(trip.to),
    title: 'Parabéns! Na mosca!',
    text: `O Pingo saiu ${fromPlace(trip.from.name)} e chegou ${inPlace(trip.to.name)}! O caminho tem ${trip.squares} quadradinhos de ${KM_PER_CELL} km.`,
    mood: 'feliz',
    facts: [
      { label: 'A conta', value: `${trip.squares} × ${KM_PER_CELL} km = ${formatKm(trip.answerKm)}` },
    ],
    reachable: [],
    sceneId: trip.to.sceneId,
  }
}

function interpretShort(km: number, trip: Trip): Interpretation {
  const hops = kmToSquares(km)
  const cell = trip.classic ? cellName(positionOn(trip, hops)) : undefined
  const stoppedAt = cell ? `Quadradinho ${cell}` : 'Meio do caminho'
  const close = km >= trip.answerKm - KM_PER_CELL
  return {
    kind: close ? 'quase-curto' : 'curto',
    scene: 'mapa',
    km,
    squares: hops,
    place: stoppedAt,
    title: close ? 'Por pouco!' : 'Ainda falta nadar bastante…',
    text: close
      ? `Faltou pouquinho. Ele já está vendo ${trip.to.name}.`
      : `Ele parou no meio do mar. ${trip.to.name} ainda está lá longe.`,
    mood: 'pensativo',
    facts: [swum(km), inKm(km), { label: 'Parou em', value: stoppedAt }],
    reachable: [],
  }
}

/** Passou da chegada, mas ainda não alcançou nenhum outro lugar. */
function interpretPassed(km: number, trip: Trip, next: Onward | undefined): Interpretation {
  const close = km <= trip.answerKm + KM_PER_CELL
  const facts: Fact[] = [swum(km), inKm(km), { label: 'Passou de', value: trip.to.name }]
  if (next && !close) {
    facts.push({ label: `Para ${next.stop.name}`, value: `faltariam ${formatSquares(next.squares - kmToSquares(km))}` })
  }
  return {
    kind: close ? 'quase-longe' : 'passou',
    scene: 'mundo',
    km,
    squares: kmToSquares(km),
    place: placeName(trip.to),
    title: close ? 'Passou raspando!' : 'Passou do ponto!',
    text: close
      ? `${trip.to.name} ficou um pouquinho para trás.`
      : `Passou ${fromPlace(trip.to.name)} e seguiu nadando, nadando… mas ainda não chegou em nenhum outro lugar.`,
    mood: 'pensativo',
    facts,
    reachable: [],
    sceneId: trip.to.sceneId,
  }
}

function interpretWorld(km: number, reached: Onward[], next: Onward | undefined): Interpretation {
  const last = reached[reached.length - 1]
  const destination = reachedOf(last)
  const facts: Fact[] = [swum(km), inKm(km), { label: `Até ${destination.name}`, value: formatSquares(destination.squares) }]
  if (next) {
    facts.push({ label: `Para ${next.stop.name}`, value: `faltariam ${formatSquares(next.squares - kmToSquares(km))}` })
  }
  return {
    kind: 'mundo',
    scene: 'mundo',
    km,
    squares: kmToSquares(km),
    place: placeName(destination),
    title: `Poderia chegar até ${destination.name}!`,
    text: destination.line,
    mood: destination.mood,
    facts,
    reachable: reached.slice(-8).reverse().map((item) => item.stop.name),
    destination,
    sceneId: destination.sceneId,
  }
}

function interpretLaps(km: number, trip: Trip): Interpretation {
  const laps = km / EARTH_CIRCUMFERENCE_KM
  const many = laps >= 2
  return {
    kind: 'voltas',
    scene: 'voltas',
    km,
    squares: kmToSquares(km),
    place: 'Volta ao mundo',
    title: many ? `Daria ${formatLaps(laps)} na Terra!` : 'Daria uma volta inteira na Terra!',
    text: many
      ? `Saiu ${fromPlace(trip.from.name)}, deu a volta no planeta e continuou… e continuou… e continuou.`
      : `Saiu ${fromPlace(trip.from.name)} e chegou… ${inPlace(trip.from.name)}. Pelo outro lado.`,
    mood: laps >= 4 ? 'exausto' : 'cansado',
    facts: [
      swum(km),
      inKm(km),
      { label: '1 volta na Terra', value: formatSquares(LAP_SQUARES) },
      { label: 'Voltas na Terra', value: formatLaps(laps) },
      { label: 'Até a Lua', value: `faltariam ${formatSquares(kmToSquares(MOON_KM - km))}` },
    ],
    reachable: ['Qualquer lugar do planeta'],
    laps,
  }
}

function interpretSpace(km: number, body: SpaceBody): Interpretation {
  const laps = km / EARTH_CIRCUMFERENCE_KM
  const moonTrips = km / MOON_KM
  const facts: Fact[] = [
    swum(km),
    inKm(km),
    { label: `Até ${body.label}`, value: formatSquares(kmToSquares(body.km)) },
    { label: 'Voltas na Terra', value: formatLaps(laps) },
  ]
  if (body.id !== 'lua') {
    facts.push({ label: 'Viagens até a Lua', value: formatNumber(Math.floor(moonTrips)) })
  }
  const reached = SPACE_BODIES.filter((item) => item.km <= km).map((item) => item.name).reverse()
  return {
    kind: 'espaco',
    scene: 'espaco',
    km,
    squares: kmToSquares(km),
    place: body.name,
    title: body.id === 'lua' ? 'Nadou até a Lua?!' : `Poderia chegar até ${body.label}!`,
    text: body.line,
    mood: body.id === 'sol' ? 'oculos' : 'astronauta',
    facts,
    reachable: reached,
    laps,
    body,
  }
}

/** Onde o Pingo está depois de `hops` passos no caminho desta viagem. */
export function positionOn(trip: Trip, rawHops: number): { x: number; y: number; hops: number } {
  const hops = Math.min(Math.max(0, rawHops), trip.squares)
  const index = Math.min(Math.floor(hops), Math.max(0, trip.squares - 1))
  const fraction = hops - index
  const from = trip.cells[index]
  const to = trip.cells[index + 1] ?? from
  return { x: from.x + (to.x - from.x) * fraction, y: from.y + (to.y - from.y) * fraction, hops }
}

/** Até aqui ainda tem lugar no planeta para esta viagem; depois, voltas na Terra. */
export function worldLimitKm(trip: Trip): number {
  return onwardFrom(trip).at(-1)?.km ?? trip.answerKm
}

export function interpret(km: number, trip: Trip): Interpretation {
  if (Math.abs(km - trip.answerKm) < 0.001) {
    return interpretGoal(km, trip)
  }
  if (km < trip.answerKm) {
    return interpretShort(km, trip)
  }

  const onward = onwardFrom(trip)
  const reached = onward.filter((item) => item.km <= km)
  const next = onward.find((item) => item.km > km)
  if (km <= trip.answerKm + KM_PER_CELL || reached.length === 0) {
    return interpretPassed(km, trip, next)
  }
  if (next || km <= (onward.at(-1)?.km ?? 0)) {
    return interpretWorld(km, reached, next)
  }

  const body = SPACE_BODIES.filter((item) => item.km <= km).at(-1)
  if (!body) {
    return interpretLaps(km, trip)
  }
  return interpretSpace(km, body)
}
