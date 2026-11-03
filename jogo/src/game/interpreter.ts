import { GOAL_HOPS, KM_PER_CELL, WAYPOINTS } from './config'
import { DESTINATIONS, SPACE_BODIES } from './destinations'
import { formatKm, formatLaps, formatNumber, formatSquares } from './format'
import { EARTH_CIRCUMFERENCE_KM } from './geo'
import { ANSWER_KM, cellName, kmToSquares, PATH_END_KM, placeAt, positionAtHops } from './route'
import { seaRoute } from './sea'
import type { Fact, Interpretation, ReachedDestination, SpaceBody } from './types'

/**
 * O interpretador transforma uma distância em uma viagem: onde o Pingo para,
 * o que ele "poderia alcançar", quantas voltas na Terra daria, e assim por diante.
 * Tudo é medido em quadradinhos de 150 km — a escala é lei.
 */

const MOON_KM = SPACE_BODIES[0].km
const LAP_SQUARES = EARTH_CIRCUMFERENCE_KM / KM_PER_CELL

/** Distância de cada destino seguindo o percurso: malha até a África, depois nadando pelo mar até o porto. */
export const REACHED_DESTINATIONS: readonly ReachedDestination[] = DESTINATIONS
  .map((destination) => {
    const route = seaRoute(destination.id, destination.at)
    const km = PATH_END_KM + route.seaKm + route.finalKm
    return { ...destination, km, squares: kmToSquares(km) }
  })
  .sort((a, b) => a.km - b.km)

/** Até aqui ainda tem destino no planeta; depois disso, viram voltas na Terra. */
export const WORLD_LIMIT_KM = Math.ceil(REACHED_DESTINATIONS[REACHED_DESTINATIONS.length - 1].km)

const swum = (km: number): Fact => ({ label: 'Ele nadou', value: formatSquares(kmToSquares(km)) })
const inKm = (km: number): Fact => ({ label: 'Em quilômetros', value: formatKm(km) })

function interpretGoal(km: number): Interpretation {
  return {
    kind: 'acerto',
    scene: 'mapa',
    km,
    squares: GOAL_HOPS,
    place: 'Santa Catarina, Brasil',
    title: 'Parabéns! Na mosca!',
    text: `Chegou na Ponte Hercílio Luz, em Florianópolis! O caminho tem ${GOAL_HOPS} quadradinhos de ${KM_PER_CELL} km.`,
    mood: 'feliz',
    facts: [
      { label: 'A conta', value: `${GOAL_HOPS} × ${KM_PER_CELL} km = ${formatKm(ANSWER_KM)}` },
    ],
    reachable: [],
    sceneId: 'santa-catarina',
  }
}

function interpretShort(km: number): Interpretation {
  const hops = kmToSquares(km)
  const position = positionAtHops(hops)
  const cell = cellName(position)
  const close = km >= ANSWER_KM - KM_PER_CELL
  return {
    kind: close ? 'quase-curto' : 'curto',
    scene: 'mapa',
    km,
    squares: hops,
    place: cell ? `Quadradinho ${cell}` : placeAt(hops),
    title: close ? 'Por pouco!' : 'Ainda falta nadar bastante…',
    text: close
      ? 'Faltou pouquinho. Ele já está vendo a praia de Santa Catarina.'
      : 'Ele parou no meio do mar. Santa Catarina ainda está lá longe.',
    mood: 'pensativo',
    facts: [swum(km), inKm(km), { label: 'Parou em', value: cell ? `Quadradinho ${cell}` : placeAt(hops) }],
    reachable: [],
  }
}

function interpretAlongCoast(km: number): Interpretation {
  const hops = kmToSquares(km)
  const position = positionAtHops(hops)
  const cell = cellName(position)
  const waypoint = WAYPOINTS.filter((item) => item.hops <= hops + 0.001).at(-1) ?? WAYPOINTS[WAYPOINTS.length - 1]
  const close = km <= ANSWER_KM + KM_PER_CELL
  const passed = WAYPOINTS.filter((item) => item.hops > GOAL_HOPS && item.hops <= hops + 0.001)
  return {
    kind: close ? 'quase-longe' : 'passou',
    scene: 'mapa',
    km,
    squares: hops,
    place: waypoint.place,
    title: close ? 'Passou raspando!' : waypoint.title ?? 'Passou do ponto!',
    text: close ? 'Santa Catarina ficou um pouquinho para trás.' : waypoint.line ?? '',
    mood: close ? 'pensativo' : waypoint.mood ?? 'cansado',
    facts: [swum(km), inKm(km), { label: 'Parou em', value: cell ? `Quadradinho ${cell}` : waypoint.place }],
    reachable: passed.map((item) => item.place).reverse(),
    sceneId: close ? undefined : waypoint.sceneId,
  }
}

function interpretWorld(km: number, reached: ReachedDestination[]): Interpretation {
  const destination = reached[reached.length - 1]
  const next = REACHED_DESTINATIONS.find((item) => item.km > km)
  const facts: Fact[] = [swum(km), inKm(km), { label: `Até ${destination.name}`, value: formatSquares(destination.squares) }]
  if (next) {
    facts.push({ label: `Para ${next.name}`, value: `faltariam ${formatSquares(next.squares - kmToSquares(km))}` })
  }
  return {
    kind: 'mundo',
    scene: 'mundo',
    km,
    squares: kmToSquares(km),
    place: `${destination.name}, ${destination.region}`,
    title: `Poderia chegar até ${destination.name}!`,
    text: destination.line,
    mood: destination.mood,
    facts,
    reachable: reached.slice(-8).reverse().map((item) => item.name),
    destination,
  }
}

function interpretLaps(km: number): Interpretation {
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
      ? 'Saiu da Patagônia, deu a volta no planeta e continuou… e continuou… e continuou.'
      : 'Saiu da Patagônia e chegou… na Patagônia. Pelo outro lado.',
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

export function interpret(km: number): Interpretation {
  if (Math.abs(km - ANSWER_KM) < 0.001) {
    return interpretGoal(km)
  }
  if (km < ANSWER_KM) {
    return interpretShort(km)
  }

  const reached = REACHED_DESTINATIONS.filter((item) => item.km <= km)
  if (km <= PATH_END_KM || reached.length === 0) {
    return interpretAlongCoast(km)
  }

  if (km <= WORLD_LIMIT_KM) {
    return interpretWorld(km, reached)
  }

  const body = SPACE_BODIES.filter((item) => item.km <= km).at(-1)
  if (!body) {
    return interpretLaps(km)
  }
  return interpretSpace(km, body)
}
