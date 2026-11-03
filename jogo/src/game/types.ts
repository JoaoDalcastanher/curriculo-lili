export type GridPoint = {
  /** Quadradinhos a partir da borda esquerda (coluna A começa em 0). */
  x: number
  /** Quadradinhos a partir da borda de baixo (linha 1 começa em 0). */
  y: number
}

export type LatLon = {
  lat: number
  lon: number
}

export type Waypoint = {
  hops: number
  greeting: string
  place: string
  /** Texto do cartão-postal quando a viagem termina neste trecho. */
  title?: string
  line?: string
  mood?: PenguinMood
  /** Cena própria do cartão-postal (PLACE_SCENES). */
  sceneId?: string
}

export type PenguinMood =
  | 'normal'
  | 'feliz'
  | 'pensativo'
  | 'cansado'
  | 'exausto'
  | 'calor'
  | 'oculos'
  | 'carioca'
  | 'canguru'
  | 'refresco'
  | 'frio'
  | 'astronauta'

export type VerdictKind = 'acerto' | 'curto' | 'quase-curto' | 'quase-longe' | 'passou' | 'mundo' | 'voltas' | 'espaco'

/** Em qual cena a viagem termina. */
export type Scene = 'mapa' | 'mundo' | 'voltas' | 'espaco'

export type Destination = {
  id: string
  name: string
  region: string
  at: LatLon
  line: string
  mood: PenguinMood
}

export type ReachedDestination = Destination & {
  /** Distância total desde a Patagônia, seguindo o percurso (km). */
  km: number
  squares: number
}

export type SpaceBody = {
  id: string
  name: string
  /** Nome com artigo, para frases: "a Lua", "o Sol", "Marte". */
  label: string
  km: number
  line: string
  color: string
  radius: number
}

export type Fact = {
  label: string
  value: string
}

export type Interpretation = {
  kind: VerdictKind
  scene: Scene
  km: number
  squares: number
  place: string
  title: string
  text: string
  mood: PenguinMood
  facts: Fact[]
  /** "Poderia chegar até…": lugares alcançados, do mais longe para o mais perto. */
  reachable: string[]
  destination?: ReachedDestination
  /** Cena própria do cartão-postal, quando o lugar tem uma. */
  sceneId?: string
  laps?: number
  body?: SpaceBody
}

export type TravelPosition = GridPoint & {
  hops: number
  greeting?: string
}
