import { useId } from 'react'
import type { PenguinMood } from '../game/types'

type PenguinProps = {
  mood: PenguinMood
  size?: number
  className?: string
  title?: string
}

const INK = '#1c2733'
const BELLY = '#fffdf7'
const ORANGE = '#f2994a'
const TONGUE = '#ff6f86'

/** Estrela de 5 pontas centrada em (cx, cy). */
function starPath(cx: number, cy: number, radius: number): string {
  const points = Array.from({ length: 10 }, (_, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI) / 5
    const r = index % 2 === 0 ? radius : radius * 0.45
    return `${(cx + r * Math.cos(angle)).toFixed(2)} ${(cy + r * Math.sin(angle)).toFixed(2)}`
  })
  return `M${points.join(' L')} Z`
}

/** Humores que têm desenho próprio, fora da pose de frente. */
const SCENE_MOODS: readonly PenguinMood[] = ['pensativo', 'cansado', 'exausto', 'calor', 'canguru']

/** Estouro de quadrinho (balão de "POW!"). */
function burstPath(cx: number, cy: number, radius: number, spikes: number): string {
  const points = Array.from({ length: spikes * 2 }, (_, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI) / spikes
    const r = index % 2 === 0 ? radius : radius * 0.72
    return `${(cx + r * Math.cos(angle)).toFixed(2)} ${(cy + r * Math.sin(angle)).toFixed(2)}`
  })
  return `M${points.join(' L')} Z`
}

const TONGUE_MOODS: readonly PenguinMood[] = ['exausto', 'calor']
const SWEATY_MOODS: readonly PenguinMood[] = ['exausto', 'calor']

function Eyes({ mood }: { mood: PenguinMood }) {
  if (mood === 'feliz') {
    return (
      <g fill="none" stroke={INK} strokeWidth="3.2" strokeLinecap="round">
        <path d="M44 47 q5 -6 10 0" />
        <path d="M66 47 q5 -6 10 0" />
      </g>
    )
  }

  if (mood === 'exausto') {
    return (
      <g fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" className="penguin-dizzy">
        <path d="M49 46 m-5 0 a5 5 0 1 1 5 5 a3.4 3.4 0 1 1 -3.4 -3.4 a1.8 1.8 0 1 1 1.8 1.8" />
        <path d="M71 46 m-5 0 a5 5 0 1 1 5 5 a3.4 3.4 0 1 1 -3.4 -3.4 a1.8 1.8 0 1 1 1.8 1.8" />
      </g>
    )
  }

  const lidded = mood === 'calor' || mood === 'refresco'
  return (
    <g>
      <circle cx="49" cy="46" r="4.6" fill={INK} />
      <circle cx="71" cy="46" r="4.6" fill={INK} />
      <circle cx="50.6" cy="44.4" r="1.5" fill="#fff" />
      <circle cx="72.6" cy="44.4" r="1.5" fill="#fff" />
      {lidded && (
        <g>
          <rect x="43.5" y="40" width="11" height="5.6" rx="1" fill={BELLY} />
          <rect x="65.5" y="40" width="11" height="5.6" rx="1" fill={BELLY} />
          <path d="M43.5 45.6 h11 M65.5 45.6 h11" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
    </g>
  )
}

function Beak({ mood }: { mood: PenguinMood }) {
  if (!TONGUE_MOODS.includes(mood)) {
    return (
      <g>
        <path d="M53 53 Q60 49 67 53 L60 61 Z" fill="#33414f" />
        <path d="M54.5 53 Q60 51 65.5 53" stroke="#f2b6a0" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    )
  }

  const long = mood === 'exausto'
  return (
    <g>
      <path
        d={long ? 'M55 55 Q53 78 60 80 Q67 78 65 55 Z' : 'M55 55 Q54 66 60 67.5 Q66 66 65 55 Z'}
        fill={TONGUE}
        stroke="#e0485f"
        strokeWidth="1.2"
        className="penguin-tongue"
      />
      <path d={long ? 'M60 61 V74' : 'M60 60 V63.5'} stroke="#e0485f" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M53 53 Q60 49 67 53 L60 60 Z" fill="#33414f" />
      <path d="M54.5 53 Q60 51 65.5 53" stroke="#f2b6a0" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  )
}

function Accessory({ mood, uid }: { mood: PenguinMood; uid: string }) {
  if (mood === 'carioca') {
    return (
      <g className="penguin-malandro">
        <path d="M46 68 L60 92 L74 68" fill="none" stroke="#d9d2c4" strokeWidth="2.2" strokeLinejoin="round" />
        <circle cx="60" cy="96" r="1.8" fill="#c9c2b6" />
        <circle cx="60" cy="104" r="1.8" fill="#c9c2b6" />
        <path d="M70 80 l7 -2 l1 5 l-7 1.5 z" fill="#e2574c" />
        <path d="M51 62 L59 66 L51 70 Z M69 62 L61 66 L69 70 Z" fill="#e2574c" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
        <circle cx="60" cy="66" r="2.6" fill="#c8453b" stroke={INK} strokeWidth="1.2" />
        <g transform="rotate(-8 60 14)">
          <ellipse cx="60" cy="17" rx="30" ry="5.5" fill="#f1dca0" stroke={INK} strokeWidth="2" />
          <path d="M44 16 V3 Q60 0 76 3 V16 Z" fill="#f1dca0" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
          <rect x="44" y="9.5" width="32" height="5" fill={INK} />
        </g>
        <path d="M104 64 q0 -8 6 -8 q6 0 6 6" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        <path d="M104 64 L104 116" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
        <path d="M101 74 Q104 70 107 74 L106 104 Q104 108 102 104 Z" fill="#2c3a48" />
      </g>
    )
  }

  if (mood === 'oculos') {
    return (
      <g>
        <rect x="40" y="40" width="17" height="11" rx="5" fill={INK} stroke="#ff8a3d" strokeWidth="2" />
        <rect x="63" y="40" width="17" height="11" rx="5" fill={INK} stroke="#ff8a3d" strokeWidth="2" />
        <path d="M57 44 h6" stroke="#ff8a3d" strokeWidth="2" />
        <path d="M43 43 l5 0" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
      </g>
    )
  }

  if (mood === 'refresco') {
    return (
      <g>
        <path d="M92 74 l14 0 l-3 26 l-8 0 z" fill="#ffe2b8" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        <path d="M93.4 82 l11.2 0 l-2.2 18 l-6.8 0 z" fill="#ff8a3d" />
        <path d="M101 74 l6 -14" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        <path d="M98 68 q8 -12 16 0 z" fill="#2f9e8f" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="96" cy="73" r="3" fill="#7bc96f" />
      </g>
    )
  }

  if (mood === 'frio') {
    return (
      <g>
        <path d="M30 60 q30 14 60 0 l0 9 q-30 14 -60 0 z" fill="#e2574c" />
        <path d="M74 66 l4 26 l9 -2 l-5 -24 z" fill="#c8453b" />
        <path d="M36 64 v6 M46 67 v6 M56 68 v6 M66 67 v6 M76 64 v6" stroke="#fff" strokeWidth="1.4" opacity="0.6" />
        <path d="M44 14 q16 -14 32 0 q-16 -4 -32 0 z" fill="#e2574c" />
        <circle cx="60" cy="4" r="5" fill="#fff" />
      </g>
    )
  }

  if (mood === 'feliz') {
    return (
      <g>
        <g className="penguin-party-hat">
          <clipPath id={`${uid}-hat`}>
            <path d="M44 17 Q60 11 76 15 L62 -26 Z" />
          </clipPath>
          <path d="M44 17 Q60 11 76 15 L62 -26 Z" fill="#2f9e8f" />
          <g clipPath={`url(#${uid}-hat)`} stroke="#f6b93b" strokeWidth="5">
            <path d="M30 4.2 L90 0.2" />
            <path d="M30 -9.8 L90 -13.8" />
          </g>
          <path d="M44 17 Q60 11 76 15 L62 -26 Z" fill="none" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
          <circle cx="62" cy="-28" r="5.5" fill="#ff7a2f" stroke={INK} strokeWidth="2" />
        </g>
        <g className="penguin-flag">
          <path d="M108 48 V-10" stroke={INK} strokeWidth="3" strokeLinecap="round" />
          <path d="M108 -8 L138 3 L108 14 Z" fill="#ff7a2f" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
          <path d={starPath(118, 3, 5.2)} fill="#fff" />
        </g>
        <g className="penguin-sparkles">
          <circle cx="6" cy="30" r="3" fill="#f6b93b" />
          <rect x="-2" y="18" width="7" height="4" rx="1" fill="#2f9e8f" transform="rotate(-30 1 20)" />
          <rect x="12" y="14" width="6" height="4" rx="1" fill="#e2574c" transform="rotate(25 15 16)" />
          <circle cx="0" cy="44" r="2.4" fill="#5aaee0" />
        </g>
      </g>
    )
  }

  if (mood === 'astronauta') {
    return (
      <g>
        <circle cx="60" cy="46" r="34" fill="#cde9f5" fillOpacity="0.35" stroke="#9fb6c6" strokeWidth="3" />
        <path d="M38 30 q8 -10 20 -12" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8" />
      </g>
    )
  }

  return null
}

function Extras({ mood }: { mood: PenguinMood }) {
  const sweaty = SWEATY_MOODS.includes(mood)
  return (
    <g>
      {sweaty && (
        <g fill="#5aaee0" className="penguin-sweat">
          <path d="M90 26 q5 7 0 11 q-5 -4 0 -11 z" />
          <path d="M28 32 q4 6 0 9 q-4 -3 0 -9 z" />
          {mood === 'exausto' && <path d="M98 44 q4 6 0 9 q-4 -3 0 -9 z" />}
        </g>
      )}
      {mood === 'exausto' && (
        <g fill="#f6b93b" stroke="#c98a12" strokeWidth="1" className="penguin-stars">
          <path d="M40 6 l2 4 l4 0.5 l-3 3 l1 4 l-4 -2 l-4 2 l1 -4 l-3 -3 l4 -0.5 z" />
          <path d="M80 2 l2 4 l4 0.5 l-3 3 l1 4 l-4 -2 l-4 2 l1 -4 l-3 -3 l4 -0.5 z" />
          <path d="M60 -4 l1.5 3 l3 0.4 l-2.2 2.2 l0.7 3 l-3 -1.5 l-3 1.5 l0.7 -3 l-2.2 -2.2 l3 -0.4 z" />
        </g>
      )}
      {mood === 'calor' && (
        <g stroke="#ff8a3d" strokeWidth="2.4" strokeLinecap="round">
          <path d="M14 18 l6 4 M10 30 l7 1 M20 8 l3 6" />
        </g>
      )}
    </g>
  )
}

/** Pingo de costas, com a nadadeira na testa, espiando a terra lá longe. */
function BackView() {
  return (
    <g>
      <ellipse cx="60" cy="121" rx="30" ry="4" fill={INK} opacity="0.12" />
      <ellipse cx="48" cy="118" rx="9" ry="4.5" fill={ORANGE} />
      <ellipse cx="72" cy="118" rx="9" ry="4.5" fill={ORANGE} />
      <path d="M27 64 q-14 18 -10 40 q10 -8 16 -24 z" fill={INK} />
      <path d="M60 10 C86 10 96 36 96 66 C96 98 82 116 60 116 C38 116 24 98 24 66 C24 36 34 10 60 10 Z" fill={INK} />
      <path d="M52 112 L60 124 L68 112 Z" fill={INK} />
      <path d="M31 76 Q31 98 43 109" fill="none" stroke="#e9e4da" strokeWidth="2" strokeLinecap="round" />
      <path d="M89 76 Q89 98 77 109" fill="none" stroke="#e9e4da" strokeWidth="2" strokeLinecap="round" />
      <path d="M38 40 Q60 30 82 40" fill="none" stroke="#2c3a48" strokeWidth="3" strokeLinecap="round" />
      <path d="M86 66 Q100 54 95 34 Q93 24 82 23" fill="none" stroke="#3a4a5a" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M86 66 Q100 54 95 34 Q93 24 82 23" fill="none" stroke={INK} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M84 75 Q92 68 88 62" fill="none" stroke={INK} strokeWidth="14" strokeLinecap="round" />
    </g>
  )
}

function IceCube({ x, y, size, angle }: { x: number; y: number; size: number; angle: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <rect x={-size / 2} y={-size / 2} width={size} height={size} rx={size * 0.22} fill="#e6f6fc" stroke="#8cc3dd" strokeWidth="1.4" />
      <path d={`M${-size * 0.25} ${-size * 0.2} l${size * 0.22} 0`} stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    </g>
  )
}

/** Pingo com calor, navegando dentro de um cooler cheio de gelo. */
function CoolerView() {
  return (
    <g>
      <path d="M95 45 L113 104" stroke="#8a6a44" strokeWidth="3" strokeLinecap="round" />
      <path d="M110 96 q8 4 6 14 q-8 -2 -10 -10 z" fill="#c98a12" stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />

      <g transform="translate(60 60) scale(0.66) translate(-60 -66)">
        <path d="M27 64 q-14 18 -10 40 q10 -8 16 -24 z" fill={INK} />
        <path d="M60 10 C86 10 96 36 96 66 C96 98 82 116 60 116 C38 116 24 98 24 66 C24 36 34 10 60 10 Z" fill={INK} />
        <path d="M60 52 C78 52 84 72 84 88 C84 104 74 112 60 112 C46 112 36 104 36 88 C36 72 42 52 60 52 Z" fill={BELLY} />
        <path d="M38 33 Q48 24 60 30 Q72 24 82 33 Q84 48 76 56 Q60 66 44 56 Q36 48 38 33 Z" fill={BELLY} />
        <path d="M35 64 Q60 80 85 64" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <circle cx="49" cy="46" r="4.6" fill={INK} />
        <circle cx="71" cy="46" r="4.6" fill={INK} />
        <circle cx="50.6" cy="44.4" r="1.5" fill="#fff" />
        <circle cx="72.6" cy="44.4" r="1.5" fill="#fff" />
        <path d="M53 53 Q60 49 67 53 L60 61 Z" fill="#33414f" />
        <path d="M54.5 53 Q60 51 65.5 53" stroke="#f2b6a0" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M92 66 q16 -6 20 -22 q-14 2 -24 12 z" fill={INK} />
      </g>
      <IceCube x={57} y={22} size={10} angle={12} />

      <IceCube x={30} y={70} size={11} angle={-14} />
      <IceCube x={40} y={68} size={10} angle={20} />
      <IceCube x={82} y={69} size={11} angle={8} />
      <IceCube x={91} y={71} size={9} angle={-22} />

      <rect x="16" y="72" width="88" height="34" rx="6" fill="#2f6fd6" stroke={INK} strokeWidth="1.8" />
      <rect x="14" y="70" width="92" height="9" rx="4" fill="#fff" stroke={INK} strokeWidth="1.8" />
      <rect x="50" y="84" width="20" height="5" rx="2.5" fill="#1f4f9f" />
      <path d="M22 90 h12 M86 90 h12" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.5" />

      <path d="M-40 104 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 V150 H-40 Z" fill="#9fcbe0" opacity="0.9" />
      <path d="M-40 104 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="#fff" strokeWidth="2" opacity="0.85" />

      <path d="M22 30 q4 6 0 9 q-4 -3 0 -9 z" fill="#5aaee0" />
      <path d="M96 22 q4 6 0 9 q-4 -3 0 -9 z" fill="#5aaee0" />
      <path d="M12 20 l6 4 M8 32 l7 1 M104 10 l-4 5" stroke="#ff8a3d" strokeWidth="2.4" strokeLinecap="round" />
    </g>
  )
}

const ORBIT = 'M30 34 A30 7 0 1 1 90 34 A30 7 0 1 1 30 34 Z'

/** Peixinho dando voltas na órbita pontilhada, como as estrelinhas de quem ficou tonto. */
function OrbitFish({ delay }: { delay: number }) {
  return (
    <g>
      <path d="M-7 0 Q-1 -5.5 6 0 Q-1 5.5 -7 0 Z" fill="#ff8a3d" stroke={INK} strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M-6 0 L-11 -4 L-10 0 L-11 4 Z" fill="#ff8a3d" stroke={INK} strokeWidth="1.1" strokeLinejoin="round" />
      <circle cx="2.6" cy="-1" r="1" fill={INK} />
      <animateMotion dur="3s" repeatCount="indefinite" rotate="auto" begin={`${-delay}s`} path={ORBIT} />
    </g>
  )
}

/** Pingo de cabeça para baixo dentro da boia, só os pezinhos para cima; peixes pulando em volta. */
function FloatView({ uid }: { uid: string }) {
  return (
    <g>
      <ellipse cx="60" cy="84" rx="40" ry="13" fill="#e2574c" stroke={INK} strokeWidth="1.8" />
      <ellipse cx="60" cy="82" rx="24" ry="6" fill="#7fb6d3" />

      <g className="penguin-kick">
        <path d="M43 84 Q42 60 60 57 Q78 60 77 84 Z" fill={INK} />
        <path d="M51 84 Q51 68 60 66 Q69 68 69 84 Z" fill={BELLY} />
        <g className="penguin-foot-left">
          <path d="M-3 0 L-8 -13 Q-6.5 -17 -3.5 -14 Q0 -19 3.5 -14 Q6.5 -17 8 -13 L3 0 Z" transform="translate(53 60) rotate(-22)" fill={ORANGE} stroke="#c97a2e" strokeWidth="1.2" strokeLinejoin="round" />
        </g>
        <g className="penguin-foot-right">
          <path d="M-3 0 L-8 -13 Q-6.5 -17 -3.5 -14 Q0 -19 3.5 -14 Q6.5 -17 8 -13 L3 0 Z" transform="translate(67 60) rotate(22)" fill={ORANGE} stroke="#c97a2e" strokeWidth="1.2" strokeLinejoin="round" />
        </g>
      </g>

      <clipPath id={`${uid}-float`}>
        <rect x="0" y="84" width="120" height="30" />
      </clipPath>
      <g clipPath={`url(#${uid}-float)`}>
        <ellipse cx="60" cy="84" rx="40" ry="13" fill="#e2574c" stroke={INK} strokeWidth="1.8" />
        <path d="M30 92 l6 -9 M56 97 v-10 M84 92 l-6 -9" stroke="#fff" strokeWidth="7" />
      </g>

      <path d="M-40 92 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 V150 H-40 Z" fill="#9fcbe0" opacity="0.9" />
      <path d="M-40 92 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="#fff" strokeWidth="2" opacity="0.85" />

      <g className="penguin-bubbles" fill="none" stroke="#fff" strokeWidth="1.4">
        <circle cx="38" cy="104" r="2.2" />
        <circle cx="84" cy="108" r="1.8" />
        <circle cx="60" cy="112" r="2.6" />
      </g>

      <path d={ORBIT} fill="none" stroke="#c98a12" strokeWidth="1.2" strokeDasharray="2 4" opacity="0.75" />
      <OrbitFish delay={0} />
      <OrbitFish delay={1} />
      <OrbitFish delay={2} />
    </g>
  )
}

/** Pingo com calor: dentro d'água até a cintura, chapéu de palha e protetor no bico. */
function HotView() {
  return (
    <g>
      <circle cx="102" cy="0" r="9" fill="#f8b13c" />
      <path d="M115.0 0.0 L120.0 0.0 M111.2 9.2 L114.7 12.7 M102.0 13.0 L102.0 18.0 M92.8 9.2 L89.3 12.7 M89.0 0.0 L84.0 0.0 M92.8 -9.2 L89.3 -12.7 M102.0 -13.0 L102.0 -18.0 M111.2 -9.2 L114.7 -12.7" stroke="#f8b13c" strokeWidth="2.4" strokeLinecap="round" />

      <g transform="translate(60 60) scale(0.66) translate(-60 -66)">
        <path d="M27 64 q-14 18 -10 40 q10 -8 16 -24 z" fill={INK} />
        <path d="M93 64 q14 18 10 40 q-10 -8 -16 -24 z" fill={INK} />
        <path d="M60 10 C86 10 96 36 96 66 C96 98 82 116 60 116 C38 116 24 98 24 66 C24 36 34 10 60 10 Z" fill={INK} />
        <path d="M60 52 C78 52 84 72 84 88 C84 104 74 112 60 112 C46 112 36 104 36 88 C36 72 42 52 60 52 Z" fill={BELLY} />
        <path d="M38 33 Q48 24 60 30 Q72 24 82 33 Q84 48 76 56 Q60 66 44 56 Q36 48 38 33 Z" fill={BELLY} />
        <path d="M35 64 Q60 80 85 64" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <circle cx="49" cy="46" r="4.6" fill={INK} />
        <circle cx="71" cy="46" r="4.6" fill={INK} />
        <circle cx="50.6" cy="44.4" r="1.5" fill="#fff" />
        <circle cx="72.6" cy="44.4" r="1.5" fill="#fff" />
        <path d="M53 53 Q60 49 67 53 L60 61 Z" fill="#33414f" />
        <path d="M56 54 Q60 52.5 64 54 L60 58 Z" fill="#fff" opacity="0.95" />
        <path d="M18 22 Q60 6 102 22 Q92 28 60 26 Q28 28 18 22 Z" fill="#e8c27a" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        <path d="M38 22 Q40 0 60 -2 Q80 0 82 22 Z" fill="#e8c27a" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        <path d="M39 16 Q60 10 81 16" fill="none" stroke="#e2574c" strokeWidth="5" />
      </g>

      <path d="M-40 92 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 V150 H-40 Z" fill="#9fcbe0" opacity="0.92" />
      <path d="M-40 92 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="#fff" strokeWidth="2" opacity="0.85" />

      <path d="M45 33 q3.4 5 0 7.6 q-3.4 -2.6 0 -7.6 z" fill="#5aaee0" stroke="#fff" strokeWidth="0.8" />
      <path d="M77 36 q3 4.6 0 7 q-3 -2.4 0 -7 z" fill="#5aaee0" stroke="#fff" strokeWidth="0.8" />
      <path d="M40.5 46 q2.6 4 0 6 q-2.6 -2 0 -6 z" fill="#5aaee0" stroke="#fff" strokeWidth="0.8" />
      <path d="M14 30 q3 -4 0 -8 q-3 -4 0 -8 M8 42 q3 -4 0 -8 q-3 -4 0 -8" fill="none" stroke="#ff8a3d" strokeWidth="2" strokeLinecap="round" />
    </g>
  )
}

/** Pingo lutando boxe com um canguru (Sydney). */
function BoxingView() {
  const ROO = '#c98a5a'
  const ROO_LIGHT = '#ecc9a0'
  return (
    <g>
      <ellipse cx="60" cy="121" rx="52" ry="4" fill={INK} opacity="0.12" />

      <g className="penguin-boxer">
        <g transform="translate(34 85) scale(0.62) translate(-60 -66)">
          <path d="M27 64 q-14 18 -10 40 q10 -8 16 -24 z" fill={INK} />
          <path d="M60 10 C86 10 96 36 96 66 C96 98 82 116 60 116 C38 116 24 98 24 66 C24 36 34 10 60 10 Z" fill={INK} />
          <path d="M60 52 C78 52 84 72 84 88 C84 104 74 112 60 112 C46 112 36 104 36 88 C36 72 42 52 60 52 Z" fill={BELLY} />
          <path d="M38 33 Q48 24 60 30 Q72 24 82 33 Q84 48 76 56 Q60 66 44 56 Q36 48 38 33 Z" fill={BELLY} />
          <path d="M35 64 Q60 80 85 64" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
          <circle cx="51" cy="46" r="4.6" fill={INK} />
          <circle cx="73" cy="46" r="4.6" fill={INK} />
          <circle cx="52.6" cy="44.4" r="1.5" fill="#fff" />
          <circle cx="74.6" cy="44.4" r="1.5" fill="#fff" />
          <path d="M44 38 l10 3 M80 38 l-10 3" stroke={INK} strokeWidth="3" strokeLinecap="round" />
          <path d="M55 53 Q62 49 69 53 L62 61 Z" fill="#33414f" />
          <path d="M92 60 q18 -4 26 -16 q-16 0 -28 6 z" fill={INK} />
          <ellipse cx="47" cy="117" rx="10" ry="5" fill={ORANGE} />
          <ellipse cx="73" cy="117" rx="10" ry="5" fill={ORANGE} />
        </g>
        <circle cx="72" cy="70" r="6.5" fill="#e2574c" stroke={INK} strokeWidth="1.6" />
        <path d="M68 67 q3 -2 6 0" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.7" />
        <circle cx="17" cy="84" r="5.5" fill="#e2574c" stroke={INK} strokeWidth="1.6" />
      </g>

      <g className="penguin-roo" stroke={INK} strokeWidth="1.3" strokeLinejoin="round">
        <path d="M100 104 Q118 112 122 124" fill="none" stroke={ROO} strokeWidth="7" strokeLinecap="round" />
        <path d="M80 112 Q76 82 88 64 Q98 54 104 66 Q110 84 104 112 Z" fill={ROO} />
        <path d="M86 108 Q84 86 92 72 Q100 76 100 92 Q100 104 98 108 Z" fill={ROO_LIGHT} />
        <ellipse cx="86" cy="117" rx="11" ry="4" fill={ROO} />
        <ellipse cx="102" cy="117" rx="9" ry="4" fill={ROO} />
        <path d="M92 38 Q88 24 92 16 Q98 26 96 38 Z" fill={ROO} />
        <path d="M98 40 Q100 26 106 20 Q108 32 102 42 Z" fill={ROO} />
        <path d="M93 34 Q91 26 92.5 21 M100 36 Q102 29 104.5 24" stroke={ROO_LIGHT} strokeWidth="2" strokeLinecap="round" />
        <path d="M90 66 Q88 56 94 52" fill="none" stroke={ROO} strokeWidth="9" strokeLinecap="round" />
        <ellipse cx="95" cy="46" rx="9.5" ry="8.5" fill={ROO} />
        <ellipse cx="85" cy="49" rx="7.5" ry="4.8" fill={ROO} />
        <circle cx="78.4" cy="48" r="2" fill={INK} />
        <path d="M80 52 q3 1.5 6 0.5" stroke={INK} strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <circle cx="91.5" cy="44" r="1.8" fill={INK} />
        <path d="M88 40.5 l6 2" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M90 70 Q84 66 80 64" fill="none" stroke={ROO} strokeWidth="5" strokeLinecap="round" />
        <path d="M93 80 Q88 83 84 84" fill="none" stroke={ROO} strokeWidth="5" strokeLinecap="round" />
        <circle cx="79" cy="63" r="6.5" fill="#2f6fd6" stroke={INK} strokeWidth="1.6" />
        <circle cx="82" cy="85" r="5.5" fill="#2f6fd6" stroke={INK} strokeWidth="1.6" />
      </g>

      <g className="penguin-pow" transform="translate(58 34) rotate(-10)">
        <path d={burstPath(0, 0, 15, 9)} fill="#f6b93b" stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
        <text y="2.4" textAnchor="middle" fontSize="6.6" fontWeight="800" fill={INK} fontFamily="'Bricolage Grotesque Variable', sans-serif">POW!</text>
      </g>
    </g>
  )
}

/** Pinguim-de-magalhães desenhado em SVG, com humor que muda conforme a viagem. */
export function Penguin({ mood, size = 64, className, title }: PenguinProps) {
  const uid = useId().replace(/:/g, '')
  const flipperRaised = mood === 'feliz' || mood === 'refresco'
  const droopy = mood === 'exausto'
  const leftFlipper = flipperRaised
    ? 'M28 70 q-16 -10 -18 -30 q12 6 22 22 z'
    : droopy ? 'M27 66 q-8 22 -2 42 q8 -10 10 -26 z' : 'M27 64 q-14 18 -10 40 q10 -8 16 -24 z'
  const rightFlipper = flipperRaised
    ? 'M92 70 q16 -10 18 -30 q-12 6 -22 22 z'
    : droopy ? 'M93 66 q8 22 2 42 q-8 -10 -10 -26 z' : 'M93 64 q14 18 10 40 q-10 -8 -16 -24 z'

  return (
    <svg
      className={className}
      width={size}
      height={size * (126 / 120)}
      viewBox="0 0 120 126"
      role="img"
      aria-label={title ?? 'Pingo, o pinguim'}
      data-mood={mood}
      overflow="visible"
    >
      {mood === 'pensativo' && <BackView />}
      {mood === 'cansado' && <CoolerView />}
      {mood === 'exausto' && <FloatView uid={uid} />}
      {mood === 'calor' && <HotView />}
      {mood === 'canguru' && <BoxingView />}
      {!SCENE_MOODS.includes(mood) && (
        <g>
      <ellipse cx="60" cy="121" rx="30" ry="4" fill={INK} opacity="0.12" />
      <ellipse cx="47" cy="117" rx="10" ry="5" fill={ORANGE} />
      <ellipse cx="73" cy="117" rx="10" ry="5" fill={ORANGE} />

      <path d={leftFlipper} fill={INK} />
      <path d={rightFlipper} fill={INK} />

      <path d="M60 10 C86 10 96 36 96 66 C96 98 82 116 60 116 C38 116 24 98 24 66 C24 36 34 10 60 10 Z" fill={INK} />
      <path d="M60 52 C78 52 84 72 84 88 C84 104 74 112 60 112 C46 112 36 104 36 88 C36 72 42 52 60 52 Z" fill={BELLY} />
      <path d="M38 33 Q48 24 60 30 Q72 24 82 33 Q84 48 76 56 Q60 66 44 56 Q36 48 38 33 Z" fill={BELLY} />
      <path d="M35 64 Q60 80 85 64" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />

      <Eyes mood={mood} />
      <Beak mood={mood} />
      <Extras mood={mood} />
      <Accessory mood={mood} uid={uid} />
        </g>
      )}
    </svg>
  )
}
