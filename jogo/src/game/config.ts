import type { GridPoint, Waypoint } from './types'

/** Tamanho do mapa da atividade (colunas A–O, linhas 1–15). */
export const GRID_SIZE = 15

/** A escala é lei: 1 quadradinho = 150 km. */
export const KM_PER_CELL = 150

export const COLUMN_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'] as const

/** Onde o Pingo começa (centro do quadradinho C3). */
export const START: GridPoint = { x: 2.5, y: 2.5 }

/**
 * O percurso anda só pela malha: cada letra é um passo de exatamente
 * 1 quadradinho. R = direita, U = para cima.
 *
 * Trecho 1 (21 passos): Patagônia → Santa Catarina, pelo mar, colado na costa,
 * passando por Argentina, Uruguai e Rio Grande do Sul (igual ao vídeo).
 * Trecho 2: se ele continuar, segue a costa do Brasil, cruza o Equador e
 * atravessa o Atlântico até a África.
 */
export const ROUTE_MOVES = 'RURUURRRUURURURURUUUU' + 'RRURRRURURURUUUURUUURUUURUUUUUURRRRRRRRRRRRRRRRRRRRRRRRRRR'

/** Quantos passos do percurso levam até Santa Catarina. */
export const GOAL_HOPS = 21

/** Paradas do caminho, com o balãozinho que aparece quando o Pingo passa. */
export const WAYPOINTS: readonly Waypoint[] = [
  { hops: 6, greeting: 'Oi, Argentina!', place: 'Mar da Argentina' },
  { hops: 12, greeting: 'Oi, Uruguai!', place: 'Mar do Uruguai' },
  { hops: 16, greeting: 'Oi, Rio Grande do Sul!', place: 'Litoral do Rio Grande do Sul' },
  { hops: 21, greeting: 'Cheguei em Santa Catarina!', place: 'Santa Catarina, Brasil' },
  {
    hops: 22,
    greeting: 'Opa, passei!',
    place: 'Litoral do Paraná',
    title: 'Passou do ponto!',
    line: 'Santa Catarina ficou para trás e ele seguiu nadando pela costa do Brasil.',
    mood: 'pensativo',
  },
  {
    hops: 30,
    greeting: 'Oi, Rio de Janeiro!',
    place: 'Rio de Janeiro',
    title: 'Foi parar no Rio!',
    line: 'Chapéu de palha, gravata-borboleta e guarda-chuva: virou malandro no calçadão de Copacabana.',
    mood: 'carioca',
  },
  {
    hops: 40,
    greeting: 'Oi, Salvador!',
    place: 'Salvador, Bahia',
    title: 'Chegou na Bahia!',
    line: 'Ofereceram acarajé. Ele agradeceu e pediu peixe cru.',
    mood: 'calor',
  },
  {
    hops: 46,
    greeting: 'Tchau, Brasil!',
    place: 'Natal, Rio Grande do Norte',
    title: 'Chegou na ponta do Brasil!',
    line: 'Daqui o Brasil acaba e começa o oceano inteiro pela frente.',
    mood: 'cansado',
  },
  {
    hops: 52,
    greeting: 'Cruzando o Equador!',
    place: 'Linha do Equador',
    title: 'Cruzou a Linha do Equador!',
    line: 'Mais de 30 °C na água. Pinguim da Patagônia não foi feito para isso.',
    mood: 'calor',
  },
  {
    hops: 58,
    greeting: 'Só tem mar…',
    place: 'Meio do Oceano Atlântico',
    title: 'No meio do Oceano Atlântico!',
    line: 'Nenhuma terra à vista. Só ele, os peixes e muita água salgada.',
    mood: 'exausto',
  },
  {
    hops: 79,
    greeting: 'Cheguei na África!',
    place: 'Gabão, África',
    title: 'Atravessou o oceano até a África!',
    line: 'No Gabão, elefantes passeiam na praia. Um deles deu um banho de mangueira no Pingo.',
    mood: 'feliz',
    sceneId: 'gabao',
  },
]

/** Contorno da América do Sul (coordenadas do quadriculado; x → direita, y ↑). */
export const SOUTH_AMERICA: readonly GridPoint[] = [
  { x: -5, y: 42.3 },
  { x: 4.4, y: 41.8 },
  { x: 7.6, y: 38.5 },
  { x: 12.1, y: 35.6 },
  { x: 13.1, y: 33.1 },
  { x: 15.8, y: 32.2 },
  { x: 19.5, y: 32.4 },
  { x: 21.6, y: 29.8 },
  { x: 20.6, y: 27.5 },
  { x: 19.5, y: 24.5 },
  { x: 18.3, y: 19.3 },
  { x: 16.5, y: 17.2 },
  { x: 14, y: 16.4 },
  { x: 12.8, y: 15.6 },
  { x: 12.0, y: 15 },
  { x: 11.3, y: 14.0 },
  { x: 11.15, y: 13.4 },
  { x: 11.0, y: 12.9 },
  { x: 10.62, y: 11.7 },
  { x: 9.98, y: 10.94 },
  { x: 9.27, y: 10.0 },
  { x: 8.33, y: 8.88 },
  { x: 7.98, y: 8.8 },
  { x: 7.39, y: 8.94 },
  { x: 6.74, y: 9.12 },
  { x: 6.21, y: 9.35 },
  { x: 6.15, y: 9.55 },
  { x: 6.27, y: 9.0 },
  { x: 6.92, y: 8.41 },
  { x: 7.21, y: 7.82 },
  { x: 6.98, y: 7.12 },
  { x: 6.74, y: 6.59 },
  { x: 5.98, y: 6.06 },
  { x: 5.04, y: 5.88 },
  { x: 4.04, y: 5.76 },
  { x: 3.92, y: 4.94 },
  { x: 3.62, y: 4.29 },
  { x: 2.39, y: 4.47 },
  { x: 2.27, y: 4.0 },
  { x: 2.33, y: 3.12 },
  { x: 3.04, y: 3.6 },
  { x: 3.15, y: 3.05 },
  { x: 2.74, y: 3.28 },
  { x: 2.33, y: 2.82 },
  { x: 2.15, y: 1.76 },
  { x: 2.04, y: 1.41 },
  { x: 1.62, y: 1.24 },
  { x: 0.68, y: 0.12 },
  { x: 0, y: -1 },
  { x: -5, y: -1 },
]

/** Contorno da costa oeste da África, para quando o mapa se expande. */
export const AFRICA: readonly GridPoint[] = [
  { x: 80, y: 70 },
  { x: 37, y: 70 },
  { x: 35.5, y: 54.0 },
  { x: 33.3, y: 49.6 },
  { x: 33.0, y: 44.9 },
  { x: 33.6, y: 42.2 },
  { x: 35.8, y: 39.6 },
  { x: 39.3, y: 37.8 },
  { x: 41.6, y: 37.8 },
  { x: 47.4, y: 37.4 },
  { x: 49.9, y: 37.0 },
  { x: 50.3, y: 34.1 },
  { x: 52.0, y: 29.6 },
  { x: 52.8, y: 25.2 },
  { x: 51.7, y: 21.6 },
  { x: 53.1, y: 17.8 },
  { x: 54.7, y: 12.6 },
  { x: 56.0, y: 8.9 },
  { x: 60, y: 4 },
  { x: 80, y: -1 },
]

/** Latitude do Equador nas coordenadas do quadriculado. */
export const EQUATOR_Y = 34.1

export const PLACES = {
  buenosAires: { x: 6.5, y: 9.55 },
  montevideu: { x: 7.5, y: 8.93 },
} as const satisfies Record<string, GridPoint>

/**
 * Conversão aproximada entre o quadriculado e latitude/longitude, usada para
 * desenhar o mesmo percurso no globo. O mapa é esquemático: isso é só visual.
 */
export const PROJECTION = {
  originLon: -65,
  originLat: -42.7,
  cellsPerLonDegree: 0.641,
  cellsPerLatDegree: 0.74,
} as const
