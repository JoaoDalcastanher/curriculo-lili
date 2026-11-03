import type { ReactNode } from 'react'

/**
 * Cenas próprias de cada destino para o selo do cartão-postal.
 * O selo tem 140 × 170. O Pingo é desenhado nas coordenadas de sempre
 * (120 × 126) e posicionado com PINGO_TRANSFORM; os acessórios dele usam
 * essas mesmas coordenadas, para encaixar certinho na cabeça e nas nadadeiras.
 */

const INK = '#1c2733'
const BELLY = '#fffdf7'
const ORANGE = '#f2994a'

type Flippers = 'down' | 'up' | 'right-up' | 'left-up' | 'left-only'
type Eyes = 'normal' | 'happy' | 'closed'

type FigureProps = {
  flippers?: Flippers
  eyes?: Eyes
  children?: ReactNode
  /** Acessórios desenhados atrás do corpo (ex.: mochila). */
  behind?: ReactNode
}

const LEFT_FLIPPER = {
  down: 'M27 64 q-14 18 -10 40 q10 -8 16 -24 z',
  up: 'M28 70 q-16 -10 -18 -30 q12 6 22 22 z',
}
const RIGHT_FLIPPER = {
  down: 'M93 64 q14 18 10 40 q-10 -8 -16 -24 z',
  up: 'M92 70 q16 -10 18 -30 q-12 6 -22 22 z',
}

/** O Pingo de frente, no estilo aprovado, com nadadeiras e olhos configuráveis. */
function PingoFigure({ flippers = 'down', eyes = 'normal', children, behind }: FigureProps) {
  const leftUp = flippers === 'up' || flippers === 'left-up'
  const rightUp = flippers === 'up' || flippers === 'right-up'
  return (
    <g>
      <ellipse cx="60" cy="121" rx="30" ry="4" fill={INK} opacity="0.14" />
      {behind}
      <ellipse cx="47" cy="117" rx="10" ry="5" fill={ORANGE} />
      <ellipse cx="73" cy="117" rx="10" ry="5" fill={ORANGE} />
      <path d={leftUp ? LEFT_FLIPPER.up : LEFT_FLIPPER.down} fill={INK} />
      {flippers !== 'left-only' && <path d={rightUp ? RIGHT_FLIPPER.up : RIGHT_FLIPPER.down} fill={INK} />}
      <path d="M60 10 C86 10 96 36 96 66 C96 98 82 116 60 116 C38 116 24 98 24 66 C24 36 34 10 60 10 Z" fill={INK} />
      <path d="M60 52 C78 52 84 72 84 88 C84 104 74 112 60 112 C46 112 36 104 36 88 C36 72 42 52 60 52 Z" fill={BELLY} />
      <path d="M38 33 Q48 24 60 30 Q72 24 82 33 Q84 48 76 56 Q60 66 44 56 Q36 48 38 33 Z" fill={BELLY} />
      <path d="M35 64 Q60 80 85 64" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      {eyes === 'normal' && (
        <g>
          <circle cx="49" cy="46" r="4.6" fill={INK} />
          <circle cx="71" cy="46" r="4.6" fill={INK} />
          <circle cx="50.6" cy="44.4" r="1.5" fill="#fff" />
          <circle cx="72.6" cy="44.4" r="1.5" fill="#fff" />
        </g>
      )}
      {eyes === 'happy' && (
        <g fill="none" stroke={INK} strokeWidth="3.2" strokeLinecap="round">
          <path d="M44 47 q5 -6 10 0" />
          <path d="M66 47 q5 -6 10 0" />
        </g>
      )}
      {eyes === 'closed' && (
        <g fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round">
          <path d="M44 46 q5 4 10 0" />
          <path d="M66 46 q5 4 10 0" />
        </g>
      )}
      <path d="M53 53 Q60 49 67 53 L60 61 Z" fill="#33414f" />
      <path d="M54.5 53 Q60 51 65.5 53" stroke="#f2b6a0" strokeWidth="2" fill="none" strokeLinecap="round" />
      {children}
    </g>
  )
}

/** Contorno espetado (juba do leão, estouros de quadrinho). */
function burstPath(cx: number, cy: number, radius: number, spikes: number): string {
  const points = Array.from({ length: spikes * 2 }, (_, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI) / spikes
    const r = index % 2 === 0 ? radius : radius * 0.78
    return `${(cx + r * Math.cos(angle)).toFixed(2)} ${(cy + r * Math.sin(angle)).toFixed(2)}`
  })
  return `M${points.join(' L')} Z`
}

const PINGO_TRANSFORM = 'translate(28 62) scale(0.7)'

function Stamp({ background, figure, foreground, transform = PINGO_TRANSFORM }: { background: ReactNode; figure?: ReactNode; foreground?: ReactNode; transform?: string }) {
  return (
    <svg className="postcard-horizon" viewBox="0 0 140 170" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {background}
      <g transform={transform}>{figure}</g>
      {foreground}
    </svg>
  )
}

function Sky({ top, bottom, id }: { top: string; bottom: string; id: string }) {
  return (
    <g>
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={top} />
          <stop offset="100%" stopColor={bottom} />
        </linearGradient>
      </defs>
      <rect width="140" height="170" fill={`url(#sky-${id})`} />
    </g>
  )
}

/* ---------- Tóquio: Monte Fuji, cerejeiras e sushi ---------- */
function Toquio() {
  return (
    <Stamp
      background={(
        <g>
          <Sky id="toquio" top="#fde3ea" bottom="#fff4f0" />
          <circle cx="104" cy="34" r="12" fill="#e2574c" opacity="0.85" />
          <path d="M18 104 L58 46 Q64 40 70 46 L112 104 Z" fill="#8fa6c4" />
          <path d="M48 60 L58 46 Q64 40 70 46 L80 60 Q74 56 70 60 Q64 54 58 60 Q52 56 48 60 Z" fill="#fff" />
          <rect y="102" width="140" height="68" fill="#e9dcc8" />
          <path d="M0 102 H140" stroke="#cdbb9f" strokeWidth="2" />
          {[[16, 30], [30, 18], [122, 70], [12, 76], [128, 120], [20, 132]].map(([x, y]) => (
            <path key={`${x}-${y}`} d={`M${x} ${y} q3 -4 6 0 q-3 4 -6 0 z`} fill="#f4a6bd" />
          ))}
        </g>
      )}
      figure={(
        <PingoFigure flippers="right-up">
          <path d="M34 26 Q60 16 86 26 L86 33 Q60 24 34 33 Z" fill="#fff" stroke={INK} strokeWidth="1.6" />
          <circle cx="60" cy="25" r="4" fill="#e2574c" />
          <path d="M86 28 l12 -6 M86 31 l12 2" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          <path d="M98 46 L128 24" stroke="#b07a42" strokeWidth="2.4" strokeLinecap="round" />
          <g transform="translate(125 30) rotate(-36)">
            <rect x="-8" y="-3.5" width="16" height="8" rx="3.5" fill="#fff" stroke={INK} strokeWidth="1.4" />
            <rect x="-8" y="-6.5" width="16" height="4.5" rx="2.2" fill="#ff8a6a" stroke={INK} strokeWidth="1.4" />
            <rect x="-1.8" y="-3.5" width="3.6" height="8" fill="#2c3a48" />
          </g>
          <path d="M100 50 L132 32" stroke="#b07a42" strokeWidth="2.4" strokeLinecap="round" />
        </PingoFigure>
      )}
    />
  )
}

/* ---------- Los Angeles: palmeiras, claquete e estrela da fama ---------- */
function LosAngeles() {
  return (
    <Stamp
      background={(
        <g>
          <Sky id="la" top="#ffd3a8" bottom="#fff0dc" />
          <path d="M0 86 Q30 60 60 76 Q90 58 140 80 V100 H0 Z" fill="#d9a877" />
          {[[16, 100], [124, 98]].map(([x, y]) => (
            <g key={x}>
              <path d={`M${x} ${y} Q${x + 2} ${y - 26} ${x - 2} ${y - 46}`} stroke="#8a6a44" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d={`M${x - 2} ${y - 46} q-12 -2 -18 6 M${x - 2} ${y - 46} q12 -4 18 4 M${x - 2} ${y - 46} q-8 -10 -16 -10 M${x - 2} ${y - 46} q8 -10 16 -8`} stroke="#5f8f4a" strokeWidth="4" fill="none" strokeLinecap="round" />
            </g>
          ))}
          <rect y="100" width="140" height="70" fill="#c9c2b6" />
          <rect x="36" y="136" width="68" height="40" rx="3" fill="#a35a5a" />
        </g>
      )}
      foreground={(
        <path d="M70 150 l3.4 7 l7.6 0.8 l-5.6 5.1 l1.6 7.5 l-7 -4 l-7 4 l1.6 -7.5 l-5.6 -5.1 l7.6 -0.8 z" fill="#f6b93b" stroke="#c98a12" strokeWidth="1" />
      )}
      figure={(
        <PingoFigure flippers="right-up">
          <rect x="40" y="40" width="17" height="11" rx="5" fill={INK} stroke="#f6b93b" strokeWidth="2" />
          <rect x="63" y="40" width="17" height="11" rx="5" fill={INK} stroke="#f6b93b" strokeWidth="2" />
          <path d="M57 44 h6" stroke="#f6b93b" strokeWidth="2" />
          <g transform="translate(116 18) rotate(-10)">
            <rect x="-17" y="0" width="34" height="22" rx="2.5" fill={INK} />
            <path d="M-17 0 L15 -12 L17 -6 L-15 6 Z" fill="#fff" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M-9 -2.8 l5 -1.9 l2 5 M1 -6.6 l5 -1.9 l2 5" stroke={INK} strokeWidth="3" />
            <rect x="-17" y="0" width="34" height="5" fill="#fff" />
            <path d="M-11 0 l4 5 M-1 0 l4 5 M9 0 l4 5" stroke={INK} strokeWidth="3" />
            <path d="M-12 11 h24 M-12 16 h16" stroke="#fff" strokeWidth="1.6" opacity="0.75" />
          </g>
        </PingoFigure>
      )}
    />
  )
}

/* ---------- Anchorage: montanhas nevadas, urso e salmão ---------- */
function Anchorage() {
  return (
    <Stamp
      background={(
        <g>
          <Sky id="alasca" top="#d8eaf4" bottom="#f4f9fb" />
          <path d="M0 92 L30 50 L48 72 L74 36 L104 76 L120 58 L140 84 V100 H0 Z" fill="#8fa6c4" />
          <path d="M24 58 L30 50 L36 58 Z M66 46 L74 36 L82 46 L77 44 L74 47 L70 44 Z M115 64 L120 58 L125 64 Z" fill="#fff" />
          <rect y="98" width="140" height="72" fill="#9fcbe0" />
          <path d="M0 98 q10 -5 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="#fff" strokeWidth="2" />
          <path d="M-2 118 L3 96 L14 90 L36 89 L48 94 L54 118 Z" fill="#f4fbfe" stroke="#8cc3dd" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M6 96 L13 104 L21 94 M36 90 L40 100 M12 110 L22 104" stroke="#cfe8f3" strokeWidth="1.4" fill="none" />
          <g className="polar-bear" stroke="#a9a193" strokeWidth="1.3" strokeLinejoin="round" transform="translate(-6 2)">
            <circle cx="6" cy="72" r="3" fill="#f7f4ec" />
            <rect x="8" y="78" width="7" height="12" rx="3.4" fill="#ece6d8" />
            <rect x="31" y="78" width="7" height="12" rx="3.4" fill="#ece6d8" />
            <path d="M6 80 Q4 66 18 63 Q28 58 38 63 Q46 66 47 76 Q46 84 38 84 L14 84 Q6 84 6 80 Z" fill="#f7f4ec" />
            <rect x="14" y="78" width="7" height="13" rx="3.4" fill="#f7f4ec" />
            <rect x="37" y="78" width="7" height="13" rx="3.4" fill="#f7f4ec" />
            <path d="M36 66 Q38 56 47 56 Q55 57 58 63 Q61 66 60 69 Q57 72 50 71 Q42 72 38 70 Z" fill="#f7f4ec" />
            <circle cx="42" cy="56.5" r="2.8" fill="#f7f4ec" />
            <circle cx="42" cy="56.5" r="1.2" fill="#d9d1c2" stroke="none" />
            <circle cx="60" cy="66.5" r="1.9" fill={INK} stroke="none" />
            <circle cx="49.5" cy="61.5" r="1.4" fill={INK} stroke="none" />
            <path d="M46.5 58.6 l5 1.6" stroke={INK} strokeWidth="1.3" strokeLinecap="round" />
            <path d="M54 70 q3 1 5 -0.5" stroke={INK} strokeWidth="1" fill="none" strokeLinecap="round" />
            <path d="M22 66 Q28 64 34 66" stroke="#e6e0d4" strokeWidth="1.6" fill="none" />
          </g>
          <path d="M38 80 L74 30" stroke="#8a6a44" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="44" cy="72" r="2.4" fill="#5f6b78" />
          <path d="M74 30 Q76 40 72 54" stroke="#5f6b78" strokeWidth="0.8" fill="none" />
          <path d="M72 54 q0 4 -3 4 q-2.4 0 -2.4 -2.4" stroke="#5f6b78" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <circle cx="72" cy="50" r="2" fill="#e2574c" stroke="#fff" strokeWidth="0.8" />
        </g>
      )}
      foreground={(
        <g>
          <path d="M-10 120 q10 -5 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 V170 H-10 Z" fill="#9fcbe0" />
          <path d="M-10 120 q10 -5 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="#fff" strokeWidth="2" />
        </g>
      )}
      figure={(
        <PingoFigure flippers="left-only" eyes="happy">
          <path d="M36 14 Q60 -4 84 14 Q60 8 36 14 Z" fill="#e2574c" />
          <path d="M34 16 Q60 6 86 16" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="60" cy="0" r="5" fill="#fff" />
          <path d="M88 68 Q100 40 102 4 Q108 0 113 6 Q110 44 96 72 Z" fill={INK} />
          <g transform="translate(110 4) rotate(-22)">
            <path d="M0 2 L-8 -10 L0 -6 L8 -10 Z" fill="#ff8a6a" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M0 2 Q-12 26 0 58 Q12 26 0 2 Z" fill="#ff8a6a" stroke={INK} strokeWidth="1.6" />
            <circle cx="-2" cy="50" r="1.6" fill={INK} />
            <path d="M-6 18 q6 3 12 0 M-7 28 q7 3 14 0 M-6 38 q6 3 12 0" stroke="#e2574c" strokeWidth="1.2" fill="none" />
          </g>
        </PingoFigure>
      )}
    />
  )
}

/* ---------- Seul: palco de K-pop ---------- */
function Seul() {
  const sticks = [12, 30, 50, 90, 110, 128]
  return (
    <Stamp
      background={(
        <g>
          <rect width="140" height="170" fill="#2a2140" />
          <path d="M20 0 L4 124 L44 124 Z" fill="#ff7ad9" opacity="0.22" />
          <path d="M70 0 L50 124 L90 124 Z" fill="#7ad9ff" opacity="0.22" />
          <path d="M120 0 L96 124 L136 124 Z" fill="#ffe07a" opacity="0.22" />
          {[[14, 24], [40, 12], [100, 18], [126, 40], [60, 34]].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill="#fff" opacity="0.8" />
          ))}
          <rect y="124" width="140" height="46" fill="#4b3d6e" />
          <path d="M0 124 H140" stroke="#ff7ad9" strokeWidth="2" />
          <g fill="#fff" opacity="0.85" fontFamily="'Bricolage Grotesque Variable', sans-serif" fontWeight="700">
            <text x="14" y="70" fontSize="14">♪</text>
            <text x="116" y="60" fontSize="16">♫</text>
            <text x="22" y="104" fontSize="11">♫</text>
          </g>
        </g>
      )}
      figure={(
        <PingoFigure flippers="up" eyes="happy">
          <path d="M31 40 Q30 6 60 5 Q90 6 89 40" stroke="#cfc7e6" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <rect x="25" y="35" width="8" height="13" rx="3.5" fill="#cfc7e6" stroke={INK} strokeWidth="1.2" />
          <rect x="87" y="35" width="8" height="13" rx="3.5" fill="#cfc7e6" stroke={INK} strokeWidth="1.2" />
          <path d="M30 46 Q36 58 50 58" stroke="#cfc7e6" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="51" cy="58" r="2.6" fill="#ff7ad9" stroke={INK} strokeWidth="1" />
        </PingoFigure>
      )}
      foreground={(
        <g>
          {sticks.map((x, index) => (
            <g key={x} transform={`rotate(${index % 2 === 0 ? -12 : 12} ${x} 160)`}>
              <circle cx={x} cy="140" r="6" fill="#ff7ad9" opacity="0.35" />
              <rect x={x - 2} y="136" width="4" height="22" rx="2" fill="#ffd1f1" />
              <circle cx={x} cy="137" r="3.4" fill="#fff" />
            </g>
          ))}
          {[6, 24, 42, 60, 78, 96, 114, 132].map((x) => (
            <circle key={x} cx={x} cy="166" r="9" fill="#1b1530" />
          ))}
        </g>
      )}
    />
  )
}

/* ---------- Cidade do México: bandeirinhas e taco de peixe ---------- */
function Mexico() {
  const colors = ['#e2574c', '#f6b93b', '#2f9e8f', '#ff7ad9', '#5aaee0']
  return (
    <Stamp
      background={(
        <g>
          <Sky id="mexico" top="#ffe9c4" bottom="#fff6e6" />
          <path d="M0 14 Q70 34 140 14" stroke="#8a6a44" strokeWidth="1.2" fill="none" />
          {Array.from({ length: 9 }, (_, index) => {
            const x = 6 + index * 16
            const y = 16 + Math.sin((index / 8) * Math.PI) * 9
            return <path key={x} d={`M${x} ${y} h12 v12 l-3 -2 l-3 2 l-3 -2 l-3 2 z`} fill={colors[index % colors.length]} />
          })}
          <rect y="106" width="140" height="64" fill="#e6b88a" />
          <path d="M0 106 H140" stroke="#c99a6a" strokeWidth="2" />
          <g transform="translate(118 96)">
            <rect x="-4" y="-18" width="8" height="28" rx="4" fill="#5f8f4a" />
            <rect x="-12" y="-8" width="6" height="14" rx="3" fill="#5f8f4a" />
            <rect x="6" y="-12" width="6" height="12" rx="3" fill="#5f8f4a" />
            <rect x="-10" y="8" width="20" height="10" rx="2" fill="#c8662f" />
          </g>
        </g>
      )}
      figure={(
        <PingoFigure flippers="up" eyes="happy">
          <g transform="translate(112 30) rotate(-14)">
            <path d="M16 -6 L28 -14 L25 -5 L29 4 Z" fill="#ff8a6a" stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M-17 -4 q3 -8 7 -2 q3 -8 7 -2 q3 -8 7 -2 q3 -8 7 -2 q3 -8 6 0" fill="#7bc96f" stroke="#4f9a45" strokeWidth="1" />
            <path d="M-15 -4 h30" stroke="#ff8a6a" strokeWidth="3" />
            <path d="M-18 -3 A18 16 0 0 0 18 -3 Z" fill="#f1c56b" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M-10 4 q2 2 4 0 M0 8 q2 2 4 0 M8 3 q2 2 4 0" stroke="#d9a040" strokeWidth="1.2" fill="none" />
          </g>
          <g transform="translate(6 30) rotate(-30)">
            <path d="M0 6 V22" stroke="#8a6a44" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="0" cy="0" rx="8" ry="9" fill="#e2574c" stroke={INK} strokeWidth="1.4" />
            <path d="M-6 -2 q6 3 12 0 M-6 3 q6 3 12 0" stroke="#f6b93b" strokeWidth="1.6" fill="none" />
          </g>
          <path d="M-6 16 q-3 -3 -6 -2 M-4 8 q-3 -4 -7 -4" stroke="#8a6a44" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </PingoFigure>
      )}
    />
  )
}

/* ---------- Pequim: Muralha da China ---------- */
function Pequim() {
  const wall = 'M-4 92 Q24 58 52 76 Q86 96 112 62 Q126 46 144 52'
  return (
    <Stamp
      background={(
        <g>
          <Sky id="pequim" top="#e4f0e4" bottom="#f7f4ea" />
          <path d="M0 70 Q30 40 60 60 Q92 36 140 52 V120 H0 Z" fill="#a9c98f" />
          <path d="M0 90 Q36 70 70 86 Q104 66 140 80 V120 H0 Z" fill="#8fb878" />
          <path d={wall} stroke="#a8936e" strokeWidth="11" fill="none" strokeLinecap="round" />
          <path d={wall} stroke="#c9b48f" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d={wall} stroke="#a8936e" strokeWidth="3" strokeDasharray="3 3" fill="none" transform="translate(0 -5)" />
          <g>
            <rect x="44" y="58" width="13" height="16" fill="#c9b48f" stroke="#a8936e" strokeWidth="1.2" />
            <path d="M41 58 h19 l-9.5 -7 z" fill="#a35a3a" />
            <rect x="48" y="64" width="5" height="6" fill="#8a7756" />
            <rect x="106" y="48" width="12" height="15" fill="#c9b48f" stroke="#a8936e" strokeWidth="1.2" />
            <path d="M103 48 h18 l-9 -6.5 z" fill="#a35a3a" />
          </g>
          <rect y="116" width="140" height="54" fill="#c9b48f" />
          <path d="M0 116 H140" stroke="#a8936e" strokeWidth="2" />
          <path d="M0 128 h140 M0 142 h140 M0 156 h140 M20 116 v12 M60 116 v12 M100 116 v12 M40 128 v14 M80 128 v14 M120 128 v14" stroke="#a8936e" strokeWidth="1" />
          <g transform="translate(122 98)">
            <path d="M0 0 V22" stroke="#8a6a44" strokeWidth="2.4" />
            <rect x="-16" y="-16" width="30" height="18" rx="2" fill="#fff8e6" stroke="#8a6a44" strokeWidth="1.2" />
            <text x="-1" y="-9" textAnchor="middle" fontSize="4.6" fontWeight="700" fill={INK} fontFamily="'DM Sans Variable', sans-serif">MURALHA</text>
            <text x="-1" y="-2" textAnchor="middle" fontSize="5.6" fontWeight="800" fill={INK} fontFamily="'Bricolage Grotesque Variable', sans-serif">141 ▢</text>
          </g>
        </g>
      )}
      figure={(
        <PingoFigure
          flippers="right-up"
          behind={(
            <g stroke={INK} strokeWidth="1.6" strokeLinejoin="round">
              <rect x="6" y="48" width="30" height="46" rx="8" fill="#e2574c" />
              <path d="M6 58 Q6 46 20 46 Q34 46 36 58 Z" fill="#c8453b" />
              <rect x="9" y="72" width="14" height="16" rx="4" fill="#c8453b" />
              <path d="M12 76 h8" stroke="#fff" strokeWidth="1.4" />
            </g>
          )}
        >
          <path d="M34 22 Q60 6 86 22 Q60 18 34 22 Z" fill="#2f9e8f" stroke={INK} strokeWidth="1.6" />
          <path d="M84 22 Q98 22 102 26 Q90 28 84 26 Z" fill="#2f9e8f" stroke={INK} strokeWidth="1.6" />
          <path d="M30 50 Q42 54 42 70 Q42 84 36 98" stroke="#b8443a" strokeWidth="4.5" fill="none" strokeLinecap="round" />
          <rect x="38.5" y="74" width="7" height="5" rx="1.4" fill="#f6b93b" stroke={INK} strokeWidth="1" />
          <path d="M106 36 L114 118" stroke="#8a6a44" strokeWidth="3" strokeLinecap="round" />
          <path d="M42 30 q3.4 5 0 7.6 q-3.4 -2.6 0 -7.6 z M79 31 q3 4.6 0 7 q-3 -2.4 0 -7 z M38 44 q2.6 4 0 6 q-2.6 -2 0 -6 z" fill="#5aaee0" stroke="#fff" strokeWidth="0.8" />
        </PingoFigure>
      )}
    />
  )
}

/* ---------- Singapura: sorvete derretendo no calor ---------- */
function Singapura() {
  return (
    <Stamp
      background={(
        <g>
          <Sky id="singapura" top="#bfe3f5" bottom="#ffe9c8" />
          <path d="M14 30 q6 -8 14 -3 q6 -6 12 1 q6 0 6 6 h-34 q-4 -4 2 -4 z" fill="#fff" opacity="0.9" />
          <path d="M96 18 q5 -6 11 -2 q5 -4 9 1 q5 0 5 5 h-27 q-3 -3 2 -4 z" fill="#fff" opacity="0.9" />
          <path d="M104 104 q5 -6 11 -2 q5 -4 9 1 q5 0 5 5 h-27 q-3 -3 2 -4 z" fill="#fff" opacity="0.8" />
          <g fill="#8fa6c4">
            <path d="M12 150 L14 118 L22 118 L24 150 Z" />
            <path d="M28 150 L30 118 L38 118 L40 150 Z" />
            <path d="M44 150 L46 118 L54 118 L56 150 Z" />
            <path d="M8 115 Q32 109 60 114 L60 118 L8 118 Z" />
            <rect x="66" y="128" width="9" height="22" fill="#a9bdd6" />
            <rect x="78" y="122" width="8" height="28" fill="#a9bdd6" />
          </g>
          {[96, 110, 124].map((x, index) => (
            <g key={x}>
              <path d={`M${x} 150 L${x - 1.2} ${130 + index * 3} L${x + 1.2} ${130 + index * 3} Z`} fill="#7a5a8a" />
              <path d={`M${x - 7} ${129 + index * 3} Q${x} ${123 + index * 3} ${x + 7} ${129 + index * 3} Z`} fill="#a77bbf" />
            </g>
          ))}
          <rect y="148" width="140" height="22" fill="#9fcbe0" />
          <path d="M0 148 q10 -4 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="#fff" strokeWidth="1.6" />
        </g>
      )}
      foreground={(
        <g transform="translate(70 64) rotate(-8)">
          <path d="M-62 -4 h16 M-66 4 h20 M-60 12 h14" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity="0.9" />
          <path d="M-14 -6 Q-30 -10 -52 -22 Q-46 -6 -30 -2 Z" fill="#fff3c4" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M-38 -2 L-48 -24 L-36 -24 L-26 -6 Z" fill="#c8453b" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />

          <g transform="translate(2 -16) scale(1.35)">
            <path d="M-12 10 Q-12 -14 0 -14 Q12 -14 12 10 Z" fill={INK} />
            <path d="M-8 -1 Q-4 -7 0 -4 Q4 -7 8 -1 Q9 7 0 10 Q-9 7 -8 -1 Z" fill={BELLY} />
            <circle cx="-3.6" cy="0.5" r="1.8" fill={INK} />
            <circle cx="3.6" cy="0.5" r="1.8" fill={INK} />
            <circle cx="-3" cy="-0.1" r="0.6" fill="#fff" />
            <circle cx="4.2" cy="-0.1" r="0.6" fill="#fff" />
            <path d="M-2.6 3.6 Q0 2.2 2.6 3.6 L0 6.8 Z" fill="#33414f" />
            <path d="M-13 -4 Q-13 -17 0 -17 Q13 -17 13 -4 Q8 -9 0 -9 Q-8 -9 -13 -4 Z" fill="#8a5a2a" stroke={INK} strokeWidth="1" />
            <path d="M-13 -4 Q-15 4 -11 8 Q-9 2 -9 -4 Z M13 -4 Q15 4 11 8 Q9 2 9 -4 Z" fill="#8a5a2a" stroke={INK} strokeWidth="1" />
            <path d="M-9 -9.5 H9" stroke="#5f3b18" strokeWidth="2.6" />
            <circle cx="-4.4" cy="-10" r="3.4" fill="#cfe8f3" stroke={INK} strokeWidth="1.2" />
            <circle cx="4.4" cy="-10" r="3.4" fill="#cfe8f3" stroke={INK} strokeWidth="1.2" />
            <path d="M-5.6 -11.2 l1.6 -1" stroke="#fff" strokeWidth="0.9" strokeLinecap="round" />
            <path d="M-12 10 Q-10 6 -6 9 Q0 12 6 9 Q10 6 12 10 Z" fill="#6b4a32" stroke={INK} strokeWidth="1" />
            <path d="M-6 9 Q-10 12 -14 10" stroke="#f6b93b" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>

          <path d="M-42 -2 Q-22 -9 0 -10 L26 -10 Q42 -9 44 0 Q42 9 26 10 L0 10 Q-22 8 -42 3 Z" fill="#e2574c" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M-34 0 Q-10 -3 30 -2" stroke="#fff" strokeWidth="2.2" fill="none" opacity="0.85" />
          <path d="M34 -9 Q42 -8 44 0 Q42 8 34 9 Z" fill="#5f6b78" stroke={INK} strokeWidth="1.4" />
          <ellipse cx="-38" cy="2" rx="8" ry="2.6" fill="#c8453b" stroke={INK} strokeWidth="1.2" />
          <path d="M-6 4 L22 4 L32 24 L2 24 Z" fill="#c8453b" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M6 14 H26" stroke="#fff" strokeWidth="1.6" opacity="0.7" />
          <circle cx="45" cy="0" r="3.2" fill="#3a4a5a" stroke={INK} strokeWidth="1.2" />
          <ellipse cx="46.5" cy="0" rx="2.2" ry="18" fill="#9fb6c6" opacity="0.55" />
        </g>
      )}
    />
  )
}

/* ---------- Lagos: em cima da ponte, engarrafamento gigante lá embaixo ---------- */
function Car({ x, y, color, scale = 0.42, bus = false }: { x: number; y: number; color: string; scale?: number; bus?: boolean }) {
  if (bus) {
    return (
      <g transform={`translate(${x} ${y}) scale(${scale})`}>
        <rect x="0" y="-12" width="60" height="24" rx="5" fill="#f6c445" stroke={INK} strokeWidth="2.4" />
        <rect x="0" y="4" width="60" height="3" fill={INK} />
        {[5, 19, 33, 47].map((wx) => <rect key={wx} x={wx} y="-8" width="10" height="9" rx="1.5" fill="#cfe8f3" stroke={INK} strokeWidth="1.6" />)}
        <circle cx="13" cy="13" r="5" fill={INK} />
        <circle cx="47" cy="13" r="5" fill={INK} />
      </g>
    )
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M0 8 Q0 2 6 2 L11 2 L17 -7 Q18 -8 20 -8 L32 -8 Q34 -8 35 -7 L40 2 L44 2 Q48 2 48 8 L48 12 L0 12 Z" fill={color} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M15 2 L19.5 -5 H25 V2 Z M28 2 V-5 H32.5 L37 2 Z" fill="#cfe8f3" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="11" cy="12" r="5" fill={INK} />
      <circle cx="37" cy="12" r="5" fill={INK} />
      <circle cx="11" cy="12" r="2" fill="#c9c2b6" />
      <circle cx="37" cy="12" r="2" fill="#c9c2b6" />
    </g>
  )
}

function Lagos() {
  const colors = ['#e2574c', '#2f6fd6', '#2f9e8f', '#ffffff', '#8a63d2', '#f6b93b', '#5f6b78']
  const lanes = [
    { y: 34, scale: 0.26, gap: 14, offset: 2 },
    { y: 48, scale: 0.3, gap: 16, offset: 8 },
    { y: 64, scale: 0.34, gap: 18, offset: 0 },
    { y: 82, scale: 0.4, gap: 21, offset: 6 },
    { y: 102, scale: 0.46, gap: 24, offset: -4 },
  ]
  return (
    <Stamp
      background={(
        <g>
          <Sky id="lagos" top="#ffe2b8" bottom="#fff4e2" />
          <path d="M0 26 L140 26 L140 134 L0 134 Z" fill="#8f8a82" />
          {lanes.map((lane, laneIndex) => (
            <g key={lane.y}>
              <path d={`M0 ${lane.y + 9 * lane.scale * 2.4} H140`} stroke="#f6e7b0" strokeWidth={lane.scale * 3} strokeDasharray={`${lane.scale * 22} ${lane.scale * 22}`} />
              {Array.from({ length: Math.ceil(150 / lane.gap) }, (_, index) => {
                const isBus = (index + laneIndex) % 5 === 3
                return (
                  <Car
                    key={index}
                    x={lane.offset - 8 + index * lane.gap}
                    y={lane.y}
                    color={colors[(index * 2 + laneIndex) % colors.length]}
                    bus={isBus}
                    scale={isBus ? lane.scale * 0.85 : lane.scale}
                  />
                )
              })}
            </g>
          ))}
          <g fontFamily="'Bricolage Grotesque Variable', sans-serif" fontWeight="800" fill="#e2574c">
            <text x="6" y="22" fontSize="8" transform="rotate(-8 6 22)">BI-BI!</text>
            <text x="98" y="20" fontSize="8" transform="rotate(8 98 20)">FOM!</text>
            <text x="112" y="76" fontSize="6.5" transform="rotate(-6 112 76)">BIII!</text>
          </g>
          <rect x="0" y="114" width="140" height="6" fill="#5f6b78" />
          {Array.from({ length: 15 }, (_, index) => (
            <rect key={index} x={index * 10 + 2} y="120" width="3" height="16" fill="#5f6b78" />
          ))}
          <rect x="0" y="134" width="140" height="36" fill="#bdb6aa" />
          <path d="M0 134 H140" stroke="#7d776d" strokeWidth="1.6" />
        </g>
      )}
      figure={(
        <PingoFigure eyes="closed">
          <path d="M28 44 Q26 4 60 4 Q94 4 92 44" stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M28 44 Q26 4 60 4 Q94 4 92 44" stroke="#ff8a3d" strokeWidth="3" fill="none" strokeLinecap="round" />
          <ellipse cx="27" cy="46" rx="9" ry="12" fill="#ff8a3d" stroke={INK} strokeWidth="1.8" />
          <ellipse cx="93" cy="46" rx="9" ry="12" fill="#ff8a3d" stroke={INK} strokeWidth="1.8" />
          <ellipse cx="27" cy="46" rx="4" ry="6" fill="#e26a20" />
          <ellipse cx="93" cy="46" rx="4" ry="6" fill="#e26a20" />
        </PingoFigure>
      )}
    />
  )
}

/* ---------- Saara: de camelo, guarda-sol e sonhando com peixe ---------- */
function Saara() {
  const CAMEL = '#d9a660'
  return (
    <Stamp
      transform="translate(41 22) scale(0.45)"
      background={(
        <g>
          <Sky id="saara" top="#ffd89a" bottom="#fff0d0" />
          <circle cx="56" cy="16" r="7" fill="#f8b13c" />
          <path d="M66.0 16.0 L70.0 16.0 M63.1 23.1 L65.9 25.9 M56.0 26.0 L56.0 30.0 M48.9 23.1 L46.1 25.9 M46.0 16.0 L42.0 16.0 M48.9 8.9 L46.1 6.1 M56.0 6.0 L56.0 2.0 M63.1 8.9 L65.9 6.1" stroke="#f8b13c" strokeWidth="2" strokeLinecap="round" />
          <path d="M0 100 Q30 80 64 96 Q100 76 140 94 V170 H0 Z" fill="#f1c886" />
          <path d="M0 128 Q40 108 80 124 Q112 112 140 122 V170 H0 Z" fill="#e8b46a" />
          <path d="M0 150 Q46 138 90 150 Q120 144 140 150 V170 H0 Z" fill="#dca15a" />
          <g>
            <circle cx="36" cy="50" r="2.4" fill="#fff" stroke="#c9b48f" strokeWidth="1" />
            <circle cx="30" cy="42" r="3.4" fill="#fff" stroke="#c9b48f" strokeWidth="1" />
            <ellipse cx="20" cy="26" rx="16" ry="11" fill="#fff" stroke="#c9b48f" strokeWidth="1.2" />
            <path d="M12 26 Q18 20 26 26 Q18 32 12 26 Z" fill="#ff8a6a" stroke={INK} strokeWidth="1" />
            <path d="M26 26 L31 22 L30 26 L31 30 Z" fill="#ff8a6a" stroke={INK} strokeWidth="1" strokeLinejoin="round" />
            <circle cx="15.5" cy="25" r="0.9" fill={INK} />
          </g>
          <g strokeLinejoin="round" strokeLinecap="round">
            {['M44 118 L42 134 L44 150', 'M54 120 L55 135 L54 150', 'M82 120 L84 135 L82 150', 'M92 118 L95 134 L94 150'].map((leg) => (
              <g key={leg}>
                <path d={leg} stroke={INK} strokeWidth="7.4" fill="none" />
                <path d={leg} stroke={CAMEL} strokeWidth="5" fill="none" />
              </g>
            ))}
            <path d="M34 110 Q26 118 29 128" stroke={INK} strokeWidth="3.6" fill="none" />
            <path d="M34 110 Q26 118 29 128" stroke={CAMEL} strokeWidth="2" fill="none" />
            <path d="M34 112 Q34 98 50 98 L52 92 Q60 72 68 74 Q78 72 84 92 L86 98 Q102 98 102 112 Q100 124 86 124 L48 124 Q34 124 34 112 Z" fill={CAMEL} stroke={INK} strokeWidth="1.6" />
            <path d="M96 104 Q104 94 107 82 Q109 74 116 72 Q127 72 129 79 Q129 84 121 84 Q115 86 113 96 Q110 110 100 118 Z" fill={CAMEL} stroke={INK} strokeWidth="1.6" />
            <circle cx="119" cy="76.5" r="1.5" fill={INK} />
            <path d="M115 72 q1 -4 4 -3" stroke={INK} strokeWidth="1.4" fill="none" />
            <path d="M126 81 q1.5 1 2.6 0" stroke={INK} strokeWidth="1" fill="none" />
          </g>
        </g>
      )}
      figure={(
        <PingoFigure flippers="right-up">
          <path d="M110 40 L114 -26" stroke="#8a6a44" strokeWidth="4" strokeLinecap="round" />
          <path d="M80 -24 Q114 -64 148 -24 Z" fill="#e2574c" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M101 -24 Q105 -48 114 -46 Q123 -48 127 -24" fill="#fff" stroke={INK} strokeWidth="2" />
          <path d="M42 30 q3.4 5 0 7.6 q-3.4 -2.6 0 -7.6 z M79 31 q3 4.6 0 7 q-3 -2.4 0 -7 z M38 44 q2.6 4 0 6 q-2.6 -2 0 -6 z" fill="#5aaee0" stroke="#fff" strokeWidth="0.8" />
        </PingoFigure>
      )}
      foreground={(
        <g stroke={INK} strokeWidth="1.4" strokeLinejoin="round">
          <path d="M50 96 Q60 74 68 76 Q76 74 86 96 L88 106 Q68 110 48 106 Z" fill="#2f9e8f" />
          <path d="M50 101 Q68 106 87 101" stroke="#f6b93b" strokeWidth="2.4" fill="none" />
        </g>
      )}
    />
  )
}

/* ---------- Nairóbi: safári, um fotografa o outro ---------- */
function Nairobi() {
  const SPOT = '#c98a3a'
  return (
    <Stamp
      transform="translate(10 66) scale(0.66)"
      background={(
        <g>
          <Sky id="nairobi" top="#ffd9a0" bottom="#fff1d6" />
          <circle cx="30" cy="30" r="12" fill="#ffefc4" />
          <path d="M0 104 Q40 96 80 102 Q110 98 140 104 V170 H0 Z" fill="#d9b86a" />
          <path d="M0 132 Q50 122 100 132 Q124 128 140 132 V170 H0 Z" fill="#c9a454" />
          <path d="M14 104 V84" stroke="#6b4a32" strokeWidth="2.4" />
          <path d="M2 84 Q14 72 28 84 Z" fill="#7a8a4a" />
          <g strokeLinejoin="round">
            {['M106 150 L106 118', 'M114 150 L114 120', 'M126 150 L127 120', 'M134 150 L135 118'].map((leg) => (
              <g key={leg}>
                <path d={leg} stroke={INK} strokeWidth="6.4" strokeLinecap="round" />
                <path d={leg} stroke="#f1c56b" strokeWidth="4" strokeLinecap="round" />
              </g>
            ))}
            <path d="M100 114 Q100 104 112 104 L130 106 Q140 108 140 116 Q138 124 128 124 L108 124 Q100 122 100 114 Z" fill="#f1c56b" stroke={INK} strokeWidth="1.4" />
            <path d="M104 110 Q96 80 90 56 Q86 46 94 44 Q100 44 102 52 Q108 80 116 106 Z" fill="#f1c56b" stroke={INK} strokeWidth="1.4" />
            <g transform="translate(95 44) rotate(14)">
              <path d="M3 -7 L2 -16 M8 -6 L9 -15" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="2" cy="-16.5" r="2" fill="#8a5a2a" stroke={INK} strokeWidth="1" />
              <circle cx="9" cy="-15.5" r="2" fill="#8a5a2a" stroke={INK} strokeWidth="1" />
              <path d="M9 -3 Q18 -8 20 -2 Q16 1 9 1 Z" fill="#f1c56b" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
              <path d="M10 -4 Q12 6 4 9 L-12 12 Q-20 12 -20 6 Q-20 0 -13 -1 L-2 -7 Q5 -10 10 -4 Z" fill="#f1c56b" stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
              <ellipse cx="-15" cy="6" rx="5" ry="4.4" fill="#e0b05a" />
              <circle cx="-17.5" cy="4.6" r="1" fill={INK} />
              <circle cx="0" cy="-1.5" r="1.7" fill={INK} />
              <circle cx="0.6" cy="-2.1" r="0.5" fill="#fff" />
              <path d="M-16 9.6 q3 1.6 6 0" stroke={INK} strokeWidth="1" fill="none" strokeLinecap="round" />
            </g>
            {[[100, 70], [96, 60], [106, 88], [112, 112], [124, 110], [130, 118], [108, 118]].map(([sx, sy]) => (
              <circle key={`${sx}-${sy}`} cx={sx} cy={sy} r="2.6" fill={SPOT} />
            ))}
          </g>
        </g>
      )}
      figure={(
        <PingoFigure flippers="right-up" eyes="happy">
          <path d="M28 22 Q60 -10 92 22 Q60 14 28 22 Z" fill="#e8d9b0" stroke={INK} strokeWidth="1.8" />
          <path d="M20 24 Q60 12 100 24 Q96 30 60 28 Q24 30 20 24 Z" fill="#e8d9b0" stroke={INK} strokeWidth="1.8" />
          <path d="M30 20 Q60 12 90 20" stroke="#8a6a44" strokeWidth="3" fill="none" />
          <path d="M40 60 Q60 74 82 60" stroke="#8a6a44" strokeWidth="2" fill="none" />
          <g transform="translate(116 34) rotate(8)">
            <rect x="-16" y="-11" width="32" height="22" rx="3" fill="#3a4a5a" stroke={INK} strokeWidth="2.2" />
            <rect x="-10" y="-16" width="10" height="6" rx="1.5" fill="#3a4a5a" stroke={INK} strokeWidth="1.8" />
            <circle cx="3" cy="0" r="7.5" fill="#9fb6c6" stroke={INK} strokeWidth="2.2" />
            <circle cx="3" cy="0" r="3.2" fill={INK} />
            <rect x="9" y="-8" width="5" height="3" fill="#f6b93b" />
          </g>
        </PingoFigure>
      )}
    />
  )
}

/* ---------- Marrakech: chá de hortelã… com muito gelo ---------- */
function Marrakech() {
  return (
    <Stamp
      background={(
        <g>
          <rect width="140" height="170" fill="#e9a874" />
          <path d="M24 130 V62 Q24 30 70 26 Q116 30 116 62 V130 Z" fill="#f6d9b0" />
          <path d="M34 130 V66 Q34 40 70 36 Q106 40 106 66 V130" fill="none" stroke="#2f9e8f" strokeWidth="4" />
          {[[12, 8], [34, 2]].map(([x, top]) => (
            <g key={x}>
              <path d={`M${x} 0 V${top + 10}`} stroke="#8a6a44" strokeWidth="1" />
              <path d={`M${x - 6} ${top + 14} L${x} ${top + 8} L${x + 6} ${top + 14} L${x + 4} ${top + 26} L${x - 4} ${top + 26} Z`} fill="#d9a040" stroke={INK} strokeWidth="1" />
              <path d={`M${x - 3} ${top + 16} h6 M${x - 2.5} ${top + 21} h5`} stroke="#fff3c4" strokeWidth="1.2" />
            </g>
          ))}
          <rect y="128" width="140" height="42" fill="#c8662f" />
          {Array.from({ length: 8 }, (_, index) => (
            <path key={index} d={`M${index * 18 + 9} 134 l6 6 l-6 6 l-6 -6 Z`} fill="#2f9e8f" />
          ))}
          <path d="M0 152 H140" stroke="#f6b93b" strokeWidth="2" />
        </g>
      )}
      figure={(
        <PingoFigure flippers="right-up" eyes="happy">
          <g transform="translate(110 22)">
            <path d="M-11 -2 L-8 24 Q0 28 8 24 L11 -2 Z" fill="#cfe8f3" fillOpacity="0.7" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M-9.4 8 L-8 24 Q0 28 8 24 L9.4 8 Z" fill="#7bc96f" opacity="0.8" />
            {[[-6, -6], [3, -9], [-1, -16], [7, -18], [-8, -14], [2, -25]].map(([cx, cy], index) => (
              <rect key={index} x={cx - 5} y={cy - 5} width="10" height="10" rx="2.4" fill="#e6f6fc" stroke="#8cc3dd" strokeWidth="1.6" transform={`rotate(${index * 17} ${cx} ${cy})`} />
            ))}
            <path d="M-4 -30 q-4 -6 2 -9 q2 5 -2 9 z" fill="#5f9a4a" />
          </g>
        </PingoFigure>
      )}
      foreground={(
        <g>
          <path d="M91.5 33 Q95 44 101 54" stroke="#b5732f" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <g transform="translate(119 18) rotate(-20)">
            <path d="M-12 4 Q-12 -10 0 -10 Q12 -10 12 4 Q12 10 0 10 Q-12 10 -12 4 Z" fill="#c9d6df" stroke={INK} strokeWidth="1.6" />
            <path d="M-12 0 Q-22 -2 -26 6" stroke="#c9d6df" strokeWidth="3.6" fill="none" strokeLinecap="round" />
            <path d="M-12 0 Q-22 -2 -26 6" stroke={INK} strokeWidth="1" fill="none" strokeLinecap="round" />
            <path d="M-4 -10 L0 -17 L4 -10 Z" fill="#c9d6df" stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M12 -4 Q20 -2 16 8" stroke={INK} strokeWidth="1.8" fill="none" />
          </g>
        </g>
      )}
    />
  )
}

/* ---------- Cidade do Cabo: foto de família com os pinguins-africanos ---------- */
function AfricanCousin() {
  return (
    <PingoFigure flippers="up" eyes="happy">
      <path d="M40 34 q6 -6 12 0 M68 34 q6 -6 12 0" stroke="#ff9e8a" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="52" cy="92" r="2.4" fill={INK} />
      <circle cx="66" cy="100" r="2" fill={INK} />
      <circle cx="60" cy="86" r="1.6" fill={INK} />
    </PingoFigure>
  )
}

function CidadeDoCabo() {
  return (
    <Stamp
      transform="translate(36 64) scale(0.6)"
      background={(
        <g>
          <Sky id="cabo" top="#cfe8f3" bottom="#f4f9fb" />
          <path d="M8 74 L24 46 L94 44 L112 72 Z" fill="#8fa6c4" />
          <path d="M24 46 L94 44" stroke="#a9bdd6" strokeWidth="3" />
          <path d="M28 44 q10 -6 20 0 q10 -6 22 0 q10 -6 20 0" fill="#fff" opacity="0.9" />
          <rect y="72" width="140" height="30" fill="#9fcbe0" />
          <path d="M0 72 q10 -4 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="#fff" strokeWidth="1.6" />
          <rect y="100" width="140" height="70" fill="#f3dfb4" />
          <ellipse cx="18" cy="104" rx="22" ry="14" fill="#a8a196" stroke="#7d776d" strokeWidth="1.2" />
          <ellipse cx="126" cy="100" rx="20" ry="16" fill="#a8a196" stroke="#7d776d" strokeWidth="1.2" />
          <ellipse cx="108" cy="110" rx="12" ry="8" fill="#bdb6aa" stroke="#7d776d" strokeWidth="1.2" />
          <g transform="translate(2 92) scale(0.46)"><AfricanCousin /></g>
          <g transform="translate(90 92) scale(0.46)"><AfricanCousin /></g>
        </g>
      )}
      figure={(
        <PingoFigure flippers="up" eyes="happy">
          <g transform="translate(114 30) rotate(10)">
            <path d="M-8 -4 L-5 20 Q0 23 5 20 L8 -4 Z" fill="#ffe2b8" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M-7 4 L-5 20 Q0 23 5 20 L7 4 Z" fill="#ff8a3d" />
            <path d="M2 -4 L8 -18" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="-4" cy="-4" r="3" fill="#7bc96f" />
          </g>
          <g transform="translate(6 30) rotate(-10)">
            <path d="M-8 -4 L-5 20 Q0 23 5 20 L8 -4 Z" fill="#ffe2b8" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M-7 4 L-5 20 Q0 23 5 20 L7 4 Z" fill="#f6b93b" />
            <path d="M-2 -4 L-8 -18" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
          </g>
        </PingoFigure>
      )}
    />
  )
}

/* ---------- Cairo: selfie com as pirâmides e a esfinge emburrada ---------- */
function Cairo() {
  return (
    <Stamp
      transform="translate(28 62) scale(0.7)"
      background={(
        <g>
          <Sky id="cairo" top="#ffd9a0" bottom="#fff2d8" />
          <circle cx="118" cy="20" r="7" fill="#f8b13c" />
          <path d="M128.0 20.0 L132.0 20.0 M125.1 27.1 L127.9 29.9 M118.0 30.0 L118.0 34.0 M110.9 27.1 L108.1 29.9 M108.0 20.0 L104.0 20.0 M110.9 12.9 L108.1 10.1 M118.0 10.0 L118.0 6.0 M125.1 12.9 L127.9 10.1" stroke="#f8b13c" strokeWidth="2" strokeLinecap="round" />
          <path d="M6 100 L36 52 L66 100 Z" fill="#d9a660" stroke="#b5823e" strokeWidth="1.2" />
          <path d="M36 52 L66 100 L52 100 Z" fill="#c4904a" />
          <path d="M54 100 L86 46 L118 100 Z" fill="#e3b46c" stroke="#b5823e" strokeWidth="1.2" />
          <path d="M86 46 L118 100 L102 100 Z" fill="#cf9d55" />
          <path d="M104 100 L122 72 L140 100 Z" fill="#d9a660" stroke="#b5823e" strokeWidth="1.2" />
          <rect y="98" width="140" height="72" fill="#f1c886" />
        </g>
      )}
      figure={(
        <PingoFigure flippers="up">
          <clipPath id="mummy-body">
            <path d="M60 10 C86 10 96 36 96 66 C96 98 82 116 60 116 C38 116 24 98 24 66 C24 36 34 10 60 10 Z" />
          </clipPath>
          <g clipPath="url(#mummy-body)">
              <rect x="0" y="14" width="120" height="7" fill="#f4ecd8" transform="rotate(-6 60 14)" />
              <rect x="0" y="24" width="120" height="7" fill="#e9dfc4" transform="rotate(5 60 24)" />
              <rect x="0" y="56" width="120" height="7" fill="#f4ecd8" transform="rotate(-4 60 56)" />
              <rect x="0" y="64" width="120" height="7" fill="#e9dfc4" transform="rotate(6 60 64)" />
              <rect x="0" y="73" width="120" height="7" fill="#f4ecd8" transform="rotate(-5 60 73)" />
              <rect x="0" y="82" width="120" height="7" fill="#e9dfc4" transform="rotate(4 60 82)" />
              <rect x="0" y="91" width="120" height="7" fill="#f4ecd8" transform="rotate(-6 60 91)" />
              <rect x="0" y="100" width="120" height="7" fill="#e9dfc4" transform="rotate(5 60 100)" />
              <rect x="0" y="109" width="120" height="7" fill="#f4ecd8" transform="rotate(-3 60 109)" />
            <rect x="0" y="34" width="120" height="6" fill="#f4ecd8" transform="rotate(3 60 34)" />
          </g>
          <g clipPath="url(#mummy-body)" stroke="#c9bb98" strokeWidth="0.8" fill="none">
            <path d="M20 21 L100 9 M20 31 L100 39 M20 62 L100 55 M20 70 L100 79 M20 80 L100 72 M20 88 L100 94 M20 98 L100 88" />
          </g>
          <path d="M28 70 q-16 -10 -18 -30 q12 6 22 22 z" fill="#f4ecd8" stroke="#c9bb98" strokeWidth="1" />
          <path d="M92 70 q16 -10 18 -30 q-12 6 -22 22 z" fill="#e9dfc4" stroke="#c9bb98" strokeWidth="1" />
          <path d="M14 44 l10 4 M20 56 l8 2 M100 48 l10 -4 M94 58 l8 -2" stroke="#c9bb98" strokeWidth="1" />
          <path d="M88 96 Q104 104 112 120 Q116 128 124 126" stroke="#f4ecd8" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M88 96 Q104 104 112 120 Q116 128 124 126" stroke="#c9bb98" strokeWidth="0.8" fill="none" />
          <path d="M53 53 Q60 49 67 53 L60 61 Z" fill="#33414f" />
        </PingoFigure>
      )}
    />
  )
}

/* ---------- Atenas: o Pingo virou estátua grega ---------- */
function Atenas() {
  const MARBLE = '#e7e3da'
  const MARBLE_LIGHT = '#f6f4ef'
  const VEIN = '#c4bdb0'
  return (
    <Stamp
      transform="translate(34 30) scale(0.6)"
      background={(
        <g>
          <Sky id="atenas" top="#bfe0f2" bottom="#eef7fb" />
          <path d="M0 86 Q40 70 80 80 Q110 72 140 82 V120 H0 Z" fill="#c9c08f" />
          <g transform="translate(86 46)" fill="#f1ece0" stroke="#bfb6a3" strokeWidth="0.8">
            <path d="M0 10 L22 2 L44 10 Z" />
            <rect x="0" y="10" width="44" height="3" />
            {[2, 9, 16, 23, 30, 37].map((x) => <rect key={x} x={x} y="13" width="4" height="18" />)}
            <rect x="-2" y="31" width="48" height="3" />
          </g>
          <rect y="118" width="140" height="52" fill="#ded5c0" />
          <path d="M0 118 H140" stroke="#bfb6a3" strokeWidth="1.4" />
          <rect x="24" y="110" width="92" height="40" rx="2" fill={MARBLE} stroke={VEIN} strokeWidth="1.4" />
          <rect x="18" y="104" width="104" height="8" rx="2" fill={MARBLE_LIGHT} stroke={VEIN} strokeWidth="1.4" />
          <rect x="18" y="148" width="104" height="8" rx="2" fill={MARBLE_LIGHT} stroke={VEIN} strokeWidth="1.4" />
          <text x="70" y="134" textAnchor="middle" fontSize="11" fontWeight="700" letterSpacing="2" fill="#a39a88" fontFamily="'Bricolage Grotesque Variable', serif">ΠΙΝΓΚΟ</text>
          <path d="M120 160 l8 -4 l6 3 l-3 6 l-9 1 z" fill={MARBLE} stroke={VEIN} strokeWidth="1" />
        </g>
      )}
      figure={(
        <g>
          <ellipse cx="47" cy="117" rx="10" ry="5" fill={MARBLE} stroke={VEIN} strokeWidth="1.2" />
          <ellipse cx="73" cy="117" rx="10" ry="5" fill={MARBLE} stroke={VEIN} strokeWidth="1.2" />
          <path d="M28 70 q-16 -10 -18 -30 q12 6 22 22 z" fill={MARBLE} stroke={VEIN} strokeWidth="1.4" />
          <path d="M60 10 C86 10 96 36 96 66 C96 98 82 116 60 116 C38 116 24 98 24 66 C24 36 34 10 60 10 Z" fill={MARBLE} stroke={VEIN} strokeWidth="1.6" />
          <path d="M60 52 C78 52 84 72 84 88 C84 104 74 112 60 112 C46 112 36 104 36 88 C36 72 42 52 60 52 Z" fill={MARBLE_LIGHT} />
          <path d="M38 33 Q48 24 60 30 Q72 24 82 33 Q84 48 76 56 Q60 66 44 56 Q36 48 38 33 Z" fill={MARBLE_LIGHT} />
          <path d="M28 60 Q50 90 96 74 L96 86 Q56 104 30 76 Z" fill="#f1ede4" stroke={VEIN} strokeWidth="1.2" />
          <path d="M36 70 Q58 92 94 80 M40 80 Q60 96 92 88" stroke={VEIN} strokeWidth="1" fill="none" />
          <path d="M44 46 q5 3 10 0 M66 46 q5 3 10 0" stroke={VEIN} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M53 53 Q60 49 67 53 L60 61 Z" fill="#d8d2c6" stroke={VEIN} strokeWidth="1.2" />
          <path d="M92 64 l8 2 l-2 8 l-6 -2" fill={MARBLE} stroke={VEIN} strokeWidth="1.2" />
          <path d="M96 66 l2 3 l-2 2" stroke={VEIN} strokeWidth="1" fill="none" />
          <path d="M70 20 l4 6 l-2 5 M40 96 l6 4" stroke={VEIN} strokeWidth="1" fill="none" />
          <path d="M30 22 Q60 2 90 22" stroke="#7a9a5a" strokeWidth="3" fill="none" />
          {[[34, 18, -40], [42, 12, -30], [52, 8, -15], [68, 8, 15], [78, 12, 30], [86, 18, 40]].map(([x, y, r]) => (
            <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="4.5" ry="2.2" fill="#8fb46a" transform={`rotate(${r} ${x} ${y})`} />
          ))}
        </g>
      )}
    />
  )
}

/* ---------- Madri: churros com chocolate, nadadeiras melecadas ---------- */
function Madri() {
  return (
    <Stamp
      background={(
        <g>
          <Sky id="madri" top="#ffe3c4" bottom="#fff3e4" />
          <rect y="36" width="140" height="84" fill="#b8553a" />
          <path d="M0 36 H140" stroke="#8a3a26" strokeWidth="2" />
          {[8, 36, 64, 92, 120].map((x) => (
            <g key={x}>
              <rect x={x} y="46" width="12" height="16" fill="#f6e7c8" stroke="#8a3a26" strokeWidth="1" />
              <path d={`M${x} 46 h12 M${x + 6} 46 v16`} stroke="#8a3a26" strokeWidth="1" />
              <path d={`M${x - 2} 120 V92 Q${x - 2} 78 ${x + 6} 78 Q${x + 14} 78 ${x + 14} 92 V120 Z`} fill="#5a2a1e" />
            </g>
          ))}
          <rect y="118" width="140" height="52" fill="#d9c9a8" />
          {Array.from({ length: 7 }, (_, row) => Array.from({ length: 10 }, (_, col) => (
            <rect key={`${row}-${col}`} x={col * 14 + (row % 2) * 7 - 4} y={120 + row * 7} width="12" height="5" rx="2" fill="#cdbb96" />
          )))}
        </g>
      )}
      figure={(
        <PingoFigure flippers="right-up" eyes="happy">
          <g transform="translate(112 28) rotate(24)">
            <rect x="-4" y="-24" width="8" height="40" rx="4" fill="#e0a663" stroke={INK} strokeWidth="1.6" />
            <path d="M-1.4 -20 V12 M1.4 -20 V12" stroke="#b07a42" strokeWidth="1" />
            <path d="M-4 -24 Q0 -30 4 -24 L4 -14 Q0 -10 -4 -14 Z" fill="#5a2a1e" />
          </g>
          <g transform="translate(14 104)">
            <path d="M-12 -10 L-10 10 Q0 14 10 10 L12 -10 Z" fill="#fff" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
            <ellipse cx="0" cy="-10" rx="12" ry="3.4" fill="#5a2a1e" stroke={INK} strokeWidth="1.4" />
            <path d="M12 -4 Q20 -2 18 6 Q16 8 11 6" stroke={INK} strokeWidth="1.8" fill="none" />
            <path d="M-4 -18 q-3 -4 0 -8 M4 -18 q-3 -4 0 -8" stroke="#c9bfb0" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          </g>
          <path d="M58 58 q3 4 6 0 q-1 5 -3 6 q-2 -1 -3 -6 z" fill="#5a2a1e" />
          <circle cx="47" cy="56" r="2" fill="#5a2a1e" />
          <path d="M104 44 Q110 40 112 46 Q110 52 106 54 Q102 50 104 44 Z M96 58 q4 2 6 0 q0 6 -3 8 q-3 -3 -3 -8 z" fill="#5a2a1e" />
          <path d="M18 96 Q24 92 26 98 Q22 104 18 102 Z M26 80 q3 2 5 0 q0 5 -2.5 6 q-2.5 -2 -2.5 -6 z" fill="#5a2a1e" />
        </PingoFigure>
      )}
    />
  )
}

const MANE = '#c8662f'
const LION = '#f1b860'

function Lion({ transform }: { transform: string }) {
  return (
    <g strokeLinejoin="round" transform={transform}>
            <path d="M126 122 Q138 112 134 100" stroke={INK} strokeWidth="3.4" fill="none" strokeLinecap="round" />
            <path d="M126 122 Q138 112 134 100" stroke={LION} strokeWidth="2" fill="none" strokeLinecap="round" />
            <circle cx="134" cy="98" r="3.6" fill={MANE} stroke={INK} strokeWidth="1.2" />
            {['M96 132 L96 150', 'M104 134 L104 150', 'M118 132 L118 150', 'M126 130 L127 150'].map((leg) => (
              <g key={leg}>
                <path d={leg} stroke={INK} strokeWidth="7.4" strokeLinecap="round" />
                <path d={leg} stroke={LION} strokeWidth="5" strokeLinecap="round" />
              </g>
            ))}
            <path d="M92 128 Q92 114 106 114 L120 114 Q132 114 132 126 Q130 136 118 136 L102 136 Q92 136 92 128 Z" fill={LION} stroke={INK} strokeWidth="1.4" />
            <path d={burstPath(92, 106, 20, 12)} fill={MANE} stroke={INK} strokeWidth="1.4" />
            <circle cx="92" cy="106" r="12" fill={LION} stroke={INK} strokeWidth="1.4" />
            <circle cx="82" cy="96" r="3.4" fill={LION} stroke={INK} strokeWidth="1.2" />
            <circle cx="102" cy="96" r="3.4" fill={LION} stroke={INK} strokeWidth="1.2" />
            <ellipse cx="88" cy="104" rx="1.6" ry="2.4" fill={INK} />
            <ellipse cx="96" cy="104" rx="1.6" ry="2.4" fill={INK} />
            <path d="M84 99 l5 1.6 M100 99 l-5 1.6" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
            <ellipse cx="92" cy="110" rx="5.4" ry="4" fill="#fff3d4" />
            <path d="M90 108.6 L94 108.6 L92 111 Z" fill={INK} />
            <path d="M88.6 113.4 Q92 116 95.4 113.4" stroke={INK} strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M84 112 h-5 M84 110 l-5 -2 M100 112 h5 M100 110 l5 -2" stroke={INK} strokeWidth="0.8" />
    </g>
  )
}

/* ---------- Roma: gladiador no Coliseu contra um leão ---------- */
function Roma() {
  return (
    <Stamp
      transform="translate(10 66) scale(0.62)"
      background={(
        <g>
          <Sky id="roma" top="#ffe0b8" bottom="#fff4e6" />
          <rect y="30" width="140" height="78" fill="#e3c79a" />
          {[0, 1, 2].map((row) => (
            <g key={row}>
              <path d={`M0 ${44 + row * 20} H140`} stroke="#b5925e" strokeWidth="1" />
              {Array.from({ length: 12 }, (_, col) => {
                const x = 2 + col * 12
                const y = 30 + row * 20
                return <path key={col} d={`M${x} ${y + 14} V${y + 7} Q${x + 4} ${y + 2} ${x + 8} ${y + 7} V${y + 14} Z`} fill="#9a7a4e" />
              })}
            </g>
          ))}
          {Array.from({ length: 24 }, (_, index) => (
            <circle key={index} cx={(index * 6.1) % 140} cy={34 + (index % 3) * 20} r="1.8" fill={['#e2574c', '#2f6fd6', '#f6b93b', '#2f9e8f'][index % 4]} />
          ))}
          <rect y="98" width="140" height="10" fill="#b5925e" />
          <rect y="106" width="140" height="64" fill="#ecd39a" />
          <path d="M10 140 q4 -2 8 0 M60 150 q4 -2 8 0 M110 136 q4 -2 8 0" stroke="#d9b874" strokeWidth="1.4" fill="none" />
          <Lion transform="translate(26 4) scale(0.8)" />
          <g fontFamily="'Bricolage Grotesque Variable', sans-serif" fontWeight="800" fill="#c8453b">
            <text x="104" y="64" fontSize="8" transform="rotate(8 104 64)">ROAR!</text>
          </g>
        </g>
      )}
      figure={(
        <PingoFigure flippers="up">
          <path d="M44 38 l10 3 M76 38 l-10 3" stroke={INK} strokeWidth="3" strokeLinecap="round" />
          <path d="M42 10 Q60 -18 78 10 Q70 4 60 4 Q50 4 42 10 Z" fill="#e2574c" stroke={INK} strokeWidth="1.6" />
          <path d="M48 4 Q54 -6 60 -8 M60 -8 Q66 -6 72 4" stroke="#c8453b" strokeWidth="1.4" fill="none" />
          <path d="M28 36 Q26 8 60 6 Q94 8 92 36 Q78 28 60 28 Q42 28 28 36 Z" fill="#f6c445" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M30 32 L28 50 Q32 52 36 48 L36 32 Z M90 32 L92 50 Q88 52 84 48 L84 32 Z" fill="#f6c445" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M34 26 Q60 16 86 26" stroke="#d99a20" strokeWidth="2" fill="none" />
          <g transform="translate(10 46)">
            <circle r="18" fill="#c8453b" stroke={INK} strokeWidth="2" />
            <circle r="13" fill="none" stroke="#f6c445" strokeWidth="2.4" />
            <circle r="4" fill="#f6c445" stroke={INK} strokeWidth="1.2" />
          </g>
          <g transform="translate(108 40) rotate(120) translate(-20 0)">
            <path d="M-22 0 Q-6 -10 12 0 Q-6 10 -22 0 Z" fill="#9fb6c6" stroke={INK} strokeWidth="1.8" />
            <path d="M12 0 L22 -8 L20 0 L22 8 Z" fill="#9fb6c6" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
            <circle cx="-15" cy="-2" r="1.6" fill={INK} />
          </g>
        </PingoFigure>
      )}
    />
  )
}

/* ---------- Madagascar: a turma do zoológico procurando o Capitão ---------- */
const OUTLINE = { stroke: INK, strokeWidth: 1.6, strokeLinejoin: 'round' as const }

function Eyes2({ x, y, gap }: { x: number; y: number; gap: number }) {
  return (
    <g>
      <circle cx={x - gap} cy={y} r="2.2" fill={INK} />
      <circle cx={x + gap} cy={y} r="2.2" fill={INK} />
      <circle cx={x - gap + 0.8} cy={y - 0.8} r="0.7" fill="#fff" />
      <circle cx={x + gap + 0.8} cy={y - 0.8} r="0.7" fill="#fff" />
    </g>
  )
}

/** Leão de frente, juba redonda. */
function LionFront({ transform }: { transform: string }) {
  return (
    <g transform={transform}>
      <path d="M-14 22 Q-16 6 0 4 Q16 6 14 22 Q14 34 0 34 Q-14 34 -14 22 Z" fill={LION} {...OUTLINE} />
      <ellipse cx="-7" cy="34" rx="6" ry="3.4" fill={LION} {...OUTLINE} />
      <ellipse cx="7" cy="34" rx="6" ry="3.4" fill={LION} {...OUTLINE} />
      <path d={burstPath(0, -6, 19, 14)} fill={MANE} {...OUTLINE} />
      <circle cx="-9" cy="-16" r="4" fill={LION} {...OUTLINE} />
      <circle cx="9" cy="-16" r="4" fill={LION} {...OUTLINE} />
      <circle cx="0" cy="-5" r="12" fill={LION} {...OUTLINE} />
      <Eyes2 x={0} y={-8} gap={4.6} />
      <ellipse cx="0" cy="-0.5" rx="6" ry="4.2" fill="#fff3d4" />
      <path d="M-2.4 -3 H2.4 L0 -0.4 Z" fill={INK} />
      <path d="M-3 1.6 Q0 4 3 1.6" stroke={INK} strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </g>
  )
}

/** Zebra de frente: orelhas em pé, crina e listras. */
function ZebraFront({ transform }: { transform: string }) {
  return (
    <g transform={transform}>
      <path d="M-13 26 Q-15 10 0 8 Q15 10 13 26 Q13 38 0 38 Q-13 38 -13 26 Z" fill="#fff" {...OUTLINE} />
      <path d="M-12 18 h6 M-13 26 h7 M-12 33 h6 M12 18 h-6 M13 26 h-7 M12 33 h-6" stroke={INK} strokeWidth="2.4" />
      <ellipse cx="-6" cy="38" rx="5" ry="3" fill="#5f6b78" {...OUTLINE} />
      <ellipse cx="6" cy="38" rx="5" ry="3" fill="#5f6b78" {...OUTLINE} />
      <path d="M-8 -22 Q-14 -34 -10 -38 Q-4 -32 -4 -22 Z" fill="#fff" {...OUTLINE} />
      <path d="M8 -22 Q14 -34 10 -38 Q4 -32 4 -22 Z" fill="#fff" {...OUTLINE} />
      <path d="M-8.5 -25 Q-10 -31 -9.6 -34 M8.5 -25 Q10 -31 9.6 -34" stroke="#ff9e9e" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M-11 -4 Q-12 -24 0 -26 Q12 -24 11 -4 Q10 8 0 10 Q-10 8 -11 -4 Z" fill="#fff" {...OUTLINE} />
      <path d="M-11 -14 q4 2 6 0 M11 -14 q-4 2 -6 0 M-11 -6 q4 2 6 0 M11 -6 q-4 2 -6 0 M-3 -24 v5 M3 -24 v5" stroke={INK} strokeWidth="2" fill="none" />
      <path d="M-4 -28 Q0 -36 4 -28 Q0 -24 -4 -28 Z" fill={INK} />
      <ellipse cx="0" cy="4" rx="8.4" ry="6" fill="#c9c2b6" {...OUTLINE} />
      <circle cx="-3" cy="4" r="1.2" fill={INK} />
      <circle cx="3" cy="4" r="1.2" fill={INK} />
      <Eyes2 x={0} y={-11} gap={5.4} />
    </g>
  )
}

/** Hipopótamo de frente, cabeção e focinho largo. */
function HippoFront({ transform }: { transform: string }) {
  const SKIN = '#a59bc4'
  return (
    <g transform={transform}>
      <ellipse cx="0" cy="22" rx="20" ry="16" fill={SKIN} {...OUTLINE} />
      <ellipse cx="-10" cy="36" rx="6" ry="3.4" fill={SKIN} {...OUTLINE} />
      <ellipse cx="10" cy="36" rx="6" ry="3.4" fill={SKIN} {...OUTLINE} />
      <circle cx="-12" cy="-16" r="4" fill={SKIN} {...OUTLINE} />
      <circle cx="12" cy="-16" r="4" fill={SKIN} {...OUTLINE} />
      <path d="M-14 -6 Q-14 -18 0 -18 Q14 -18 14 -6 Z" fill={SKIN} {...OUTLINE} />
      <ellipse cx="0" cy="0" rx="17" ry="11" fill="#bcb3d8" {...OUTLINE} />
      <ellipse cx="-5" cy="-2" rx="1.6" ry="2.2" fill={INK} />
      <ellipse cx="5" cy="-2" rx="1.6" ry="2.2" fill={INK} />
      <path d="M-8 5 Q0 10 8 5" stroke={INK} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <Eyes2 x={0} y={-12} gap={6} />
    </g>
  )
}

/** Girafa de frente, pescoção, chifrinhos e manchas. */
function GiraffeFront({ transform }: { transform: string }) {
  const SKIN = '#f1c56b'
  const SPOT = '#c98a3a'
  return (
    <g transform={transform}>
      <path d="M-14 74 Q-16 58 0 56 Q16 58 14 74 Q14 86 0 86 Q-14 86 -14 74 Z" fill={SKIN} {...OUTLINE} />
      <ellipse cx="-6" cy="86" rx="5" ry="3" fill="#8a5a2a" {...OUTLINE} />
      <ellipse cx="6" cy="86" rx="5" ry="3" fill="#8a5a2a" {...OUTLINE} />
      <path d="M-6 58 L-5 4 L5 4 L6 58 Z" fill={SKIN} {...OUTLINE} />
      {[[-2, 14], [2, 26], [-2, 38], [2, 50], [-8, 66], [6, 72], [-2, 78]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.4" fill={SPOT} />
      ))}
      <path d="M-4 -14 L-5 -24 M4 -14 L5 -24" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <circle cx="-5" cy="-25" r="2.4" fill="#8a5a2a" {...OUTLINE} />
      <circle cx="5" cy="-25" r="2.4" fill="#8a5a2a" {...OUTLINE} />
      <path d="M-9 -10 Q-18 -14 -20 -8 Q-16 -5 -9 -6 Z M9 -10 Q18 -14 20 -8 Q16 -5 9 -6 Z" fill={SKIN} {...OUTLINE} />
      <path d="M-10 -6 Q-11 -18 0 -18 Q11 -18 10 -6 Q10 8 0 12 Q-10 8 -10 -6 Z" fill={SKIN} {...OUTLINE} />
      <ellipse cx="0" cy="6" rx="7" ry="5" fill="#e0b05a" {...OUTLINE} />
      <circle cx="-2.4" cy="5" r="1" fill={INK} />
      <circle cx="2.4" cy="5" r="1" fill={INK} />
      <Eyes2 x={0} y={-8} gap={4.6} />
    </g>
  )
}

function Madagascar() {
  return (
    <Stamp
      transform="translate(42 90) scale(0.44)"
      background={(
        <g>
          <Sky id="madagascar" top="#bfe3f5" bottom="#eaf6fb" />
          <rect y="62" width="140" height="22" fill="#9fcbe0" />
          <path d="M0 62 q10 -4 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="#fff" strokeWidth="1.6" />
          <g>
            <path d="M12 100 Q13 74 14 64 L18 64 Q19 74 20 100 Z" fill="#a37a58" stroke="#7a5a3a" strokeWidth="1" />
            <path d="M16 64 l-8 -6 M16 64 l8 -6 M16 64 l0 -8" stroke="#7a5a3a" strokeWidth="1.6" />
            <ellipse cx="16" cy="52" rx="14" ry="6" fill="#7a9a5a" />
          </g>
          <rect y="82" width="140" height="88" fill="#f3dfb4" />
          <GiraffeFront transform="translate(118 56) scale(0.82)" />
          <HippoFront transform="translate(26 104) scale(0.86)" />
          <LionFront transform="translate(22 136) scale(0.8)" />
          <ZebraFront transform="translate(114 126) scale(0.78)" />
          <g transform="translate(50 20)">
            <path d="M-44 -8 Q-44 -16 -34 -16 L34 -16 Q44 -16 44 -8 L44 6 Q44 14 34 14 L-2 14 L-12 24 L-10 14 L-34 14 Q-44 14 -44 6 Z" fill="#fff" stroke={INK} strokeWidth="1.4" />
            <text x="0" y="3" textAnchor="middle" fontSize="10" fontWeight="800" fill={INK} fontFamily="'Bricolage Grotesque Variable', sans-serif">Cadê o Capitão?</text>
          </g>
        </g>
      )}
      figure={(
        <PingoFigure flippers="up">
          <path d="M44 36 q5 -4 10 -1 M66 37 l10 1" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <text x="100" y="4" fontSize="30" fontWeight="800" fill="#e2574c" fontFamily="'Bricolage Grotesque Variable', sans-serif">?</text>
        </PingoFigure>
      )}
    />
  )
}

/* ---------- Paris: boina, camiseta listrada e baguete ---------- */
function Paris() {
  return (
    <Stamp
      background={(
        <g>
          <Sky id="paris" top="#dfe9f5" bottom="#fbf3ea" />
          <g fill="none" stroke="#6b5a4a" strokeWidth="1.6" strokeLinejoin="round">
            <path d="M104 112 L114 60 L118 20 L122 60 L132 112" />
            <path d="M107 96 L129 96 M110 80 L126 80 M114 60 L122 60 M116 40 L120 40" />
            <path d="M104 112 Q118 98 132 112" />
            <path d="M118 20 V12" />
          </g>
          <rect y="110" width="140" height="60" fill="#d9cdb5" />
          <path d="M0 110 H140" stroke="#b5a37e" strokeWidth="1.4" />
          <g transform="translate(14 96)">
            <rect x="-8" y="0" width="16" height="16" rx="2" fill="#7a9a5a" />
            <circle cx="-4" cy="-2" r="6" fill="#e2574c" />
            <circle cx="4" cy="-3" r="6" fill="#f4a6bd" />
            <circle cx="0" cy="-8" r="6" fill="#f6b93b" />
          </g>
        </g>
      )}
      figure={(
        <PingoFigure flippers="left-up" eyes="happy">
          <path d="M36 70 Q60 84 84 70 L84 78 Q60 92 36 78 Z M37 86 Q60 100 83 86 L82 94 Q60 108 38 94 Z" fill="#2f6fd6" opacity="0.85" />
          <path d="M30 22 Q32 6 60 6 Q90 6 92 20 Q80 26 60 24 Q40 26 30 22 Z" fill="#2c3a48" stroke={INK} strokeWidth="1.6" />
          <path d="M60 6 v-6" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
          <g transform="translate(104 92) rotate(-58)">
            <rect x="-34" y="-6" width="68" height="12" rx="6" fill="#e0a663" stroke={INK} strokeWidth="1.6" />
            <path d="M-22 -4 l6 8 M-8 -4 l6 8 M6 -4 l6 8 M20 -4 l6 8" stroke="#b07a42" strokeWidth="1.6" />
          </g>
          <path d="M93 64 q14 18 10 40 q-10 -8 -16 -24 z" fill={INK} />
        </PingoFigure>
      )}
    />
  )
}

/* ---------- Londres: Big Ben, cabine vermelha e chuva (finalmente!) ---------- */
function Londres() {
  const drops = Array.from({ length: 26 }, (_, index) => [((index * 37) % 136) + 2, ((index * 53) % 100) + 4])
  return (
    <Stamp
      background={(
        <g>
          <rect width="140" height="170" fill="#c9d3dc" />
          <path d="M10 20 q8 -10 18 -4 q8 -8 16 0 q10 0 10 8 h-44 q-6 -4 0 -4 z M84 14 q8 -10 18 -4 q8 -8 16 0 q10 0 10 8 h-44 q-6 -4 0 -4 z" fill="#aab6c2" />
          <g fill="#c9b48f" stroke="#8a7756" strokeWidth="1">
            <rect x="12" y="44" width="20" height="70" />
            <path d="M12 44 L22 24 L32 44 Z" />
            <rect x="15" y="50" width="14" height="14" fill="#fff8e6" />
            <circle cx="22" cy="57" r="5" fill="#fff" />
            <path d="M22 57 V54 M22 57 h2.4" stroke={INK} strokeWidth="0.8" />
          </g>
          <g transform="translate(112 64)">
            <rect x="0" y="0" width="22" height="50" rx="3" fill="#e2574c" stroke={INK} strokeWidth="1.4" />
            <rect x="2" y="-4" width="18" height="6" rx="2" fill="#c8453b" stroke={INK} strokeWidth="1.2" />
            {[8, 18, 28].map((y) => <rect key={y} x="4" y={y} width="14" height="8" fill="#cfe8f3" stroke="#c8453b" strokeWidth="1" />)}
          </g>
          <rect y="112" width="140" height="58" fill="#8f98a3" />
          <ellipse cx="70" cy="152" rx="40" ry="6" fill="#9fcbe0" opacity="0.8" />
          {drops.map(([x, y], index) => <path key={index} d={`M${x} ${y} l-2 6`} stroke="#5aaee0" strokeWidth="1.4" strokeLinecap="round" />)}
        </g>
      )}
      figure={(
        <PingoFigure flippers="up" eyes="happy">
          <path d="M34 22 Q34 0 60 0 Q86 0 86 22 Z" fill="#2c3a48" stroke={INK} strokeWidth="1.6" />
          <path d="M26 22 Q60 14 94 22 Q92 28 60 26 Q28 28 26 22 Z" fill="#2c3a48" stroke={INK} strokeWidth="1.6" />
          <path d="M34 16 Q60 10 86 16" stroke="#e2574c" strokeWidth="2.4" fill="none" />
          <path d="M10 124 q6 -8 12 0 M98 124 q6 -8 12 0" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
        </PingoFigure>
      )}
    />
  )
}

/* ---------- Dubai: esqui dentro do shopping ---------- */
function Dubai() {
  return (
    <Stamp
      background={(
        <g>
          <rect width="140" height="170" fill="#eef6fb" />
          <g>
            <rect x="8" y="8" width="56" height="40" rx="3" fill="#ffd89a" stroke="#8fa6c4" strokeWidth="2" />
            <path d="M8 40 Q30 34 64 38 V48 H8 Z" fill="#f1c886" />
            <path d="M34 40 L36 12 L38 40 Z" fill="#8fa6c4" />
            <path d="M44 40 V26 H50 V40 M18 40 V30 H24 V40" fill="#a9bdd6" />
            <path d="M36 8 V48 M8 28 H64" stroke="#8fa6c4" strokeWidth="1.4" />
          </g>
          <rect x="84" y="14" width="44" height="16" rx="3" fill="#2f6fd6" />
          <text x="106" y="25.5" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff" fontFamily="'Bricolage Grotesque Variable', sans-serif">SKI</text>
          <path d="M0 96 L140 60 V170 H0 Z" fill="#fff" />
          <path d="M0 96 L140 60" stroke="#cfe8f3" strokeWidth="2" />
          <path d="M98 76 l4 -10 l4 10 Z M118 70 l5 -12 l5 12 Z" fill="#5f8f4a" />
          {[[20, 60], [60, 52], [100, 40], [12, 120], [126, 100]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill="#cfe8f3" />)}
        </g>
      )}
      transform="translate(30 54) scale(0.66) rotate(-12 60 66)"
      figure={(
        <PingoFigure flippers="up" eyes="happy">
          <path d="M-6 126 L126 112" stroke="#e2574c" strokeWidth="5" strokeLinecap="round" />
          <path d="M-6 126 q-6 -2 -8 -8" stroke="#e2574c" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M10 40 L0 120 M110 40 L120 118" stroke="#5f6b78" strokeWidth="2.6" strokeLinecap="round" />
          <rect x="38" y="36" width="44" height="16" rx="7" fill="#f6b93b" stroke={INK} strokeWidth="2" />
          <rect x="42" y="39" width="36" height="10" rx="5" fill="#ff8a3d" opacity="0.7" />
          <path d="M38 44 H28 M82 44 H92" stroke={INK} strokeWidth="2.4" />
          <path d="M32 62 Q60 76 88 62 L88 70 Q60 84 32 70 Z" fill="#2f9e8f" />
          <path d="M80 68 L94 92 L86 94 L76 72 Z" fill="#2f9e8f" />
        </PingoFigure>
      )}
    />
  )
}

/* ---------- Berlim: Portão de Brandemburgo e um pretzel gigante ---------- */
function Berlim() {
  return (
    <Stamp
      background={(
        <g>
          <Sky id="berlim" top="#dfe9f5" bottom="#f6f1e6" />
          <g fill="#e6d6b4" stroke="#a8936e" strokeWidth="1.2">
            <rect x="20" y="40" width="100" height="10" />
            <rect x="14" y="50" width="112" height="6" />
            {[18, 36, 54, 80, 98, 116].map((x) => <rect key={x} x={x} y="56" width="6" height="56" />)}
            <rect x="60" y="30" width="20" height="10" />
            <path d="M64 30 l6 -8 l6 8" fill="#5f8f6a" />
          </g>
          <rect y="110" width="140" height="60" fill="#c9c2b6" />
          <path d="M0 110 H140" stroke="#a8a196" strokeWidth="1.4" />
        </g>
      )}
      figure={(
        <PingoFigure flippers="right-up">
          <path d="M44 38 q5 -3 10 0 M66 38 q5 -3 10 0" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <circle cx="49" cy="47" r="5.6" fill={INK} />
          <circle cx="71" cy="47" r="5.6" fill={INK} />
          <circle cx="50.8" cy="45" r="1.8" fill="#fff" />
          <circle cx="72.8" cy="45" r="1.8" fill="#fff" />
          <g transform="translate(118 24) scale(1.15)">
            <path d="M0 14 C-30 14 -34 -22 -10 -20 C4 -18 6 0 0 6 C-6 0 -4 -18 10 -20 C34 -22 30 14 0 14" fill="none" stroke={INK} strokeWidth="10" strokeLinejoin="round" />
            <path d="M0 14 C-30 14 -34 -22 -10 -20 C4 -18 6 0 0 6 C-6 0 -4 -18 10 -20 C34 -22 30 14 0 14" fill="none" stroke="#b5652a" strokeWidth="7" strokeLinejoin="round" />
            {[[-22, -4], [-14, -16], [14, -16], [22, -4], [-12, 10], [12, 10], [0, 2]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.3" fill="#fff" />)}
          </g>
        </PingoFigure>
      )}
    />
  )
}

/* ---------- Moscou: cúpulas coloridas, neve, ushanka e sopa ---------- */
function Moscou() {
  const flakes = Array.from({ length: 20 }, (_, index) => [((index * 41) % 136) + 2, ((index * 29) % 110) + 4])
  return (
    <Stamp
      background={(
        <g>
          <rect width="140" height="170" fill="#d8e4ee" />
          {[[24, 70, '#e2574c', '#2f9e8f'], [52, 58, '#2f6fd6', '#f6b93b'], [116, 66, '#2f9e8f', '#e2574c']].map(([x, top, a, b]) => (
            <g key={x as number}>
              <rect x={(x as number) - 8} y={(top as number) + 14} width="16" height={110 - (top as number) - 14} fill="#f1ece0" stroke="#a8936e" strokeWidth="1" />
              <path d={`M${(x as number) - 10} ${(top as number) + 16} Q${(x as number) - 12} ${(top as number) + 2} ${x} ${(top as number) - 6} Q${(x as number) + 12} ${(top as number) + 2} ${(x as number) + 10} ${(top as number) + 16} Z`} fill={a as string} stroke={INK} strokeWidth="1.2" />
              <path d={`M${(x as number) - 6} ${(top as number) + 4} Q${x} ${(top as number) + 8} ${(x as number) + 6} ${(top as number) + 4}`} stroke={b as string} strokeWidth="2.4" fill="none" />
              <path d={`M${x} ${(top as number) - 6} V${(top as number) - 14}`} stroke="#c98a12" strokeWidth="1.6" />
            </g>
          ))}
          <rect y="108" width="140" height="62" fill="#fff" />
          <path d="M0 108 Q70 100 140 108" stroke="#cfe8f3" strokeWidth="2" fill="none" />
          {flakes.map(([x, y], index) => <circle key={index} cx={x} cy={y} r="1.6" fill="#fff" />)}
        </g>
      )}
      figure={(
        <PingoFigure flippers="right-up" eyes="closed">
          <path d="M28 30 Q26 0 60 -2 Q94 0 92 30 Z" fill="#8a6a44" stroke={INK} strokeWidth="1.6" />
          <rect x="26" y="16" width="68" height="12" rx="5" fill="#b08a62" stroke={INK} strokeWidth="1.6" />
          <path d="M28 26 Q22 40 28 52 Q34 50 36 40 Z M92 26 Q98 40 92 52 Q86 50 84 40 Z" fill="#b08a62" stroke={INK} strokeWidth="1.6" />
          <circle cx="60" cy="10" r="4" fill="#e2574c" />
          <path d="M30 0 q6 -4 12 0 M76 -2 q6 -4 12 0" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          <g transform="translate(112 34) scale(0.8)">
            <path d="M-26 0 Q-24 22 0 22 Q24 22 26 0 Z" fill="#fff" stroke={INK} strokeWidth="2" />
            <ellipse cx="0" cy="0" rx="26" ry="6" fill="#c8453b" stroke={INK} strokeWidth="2" />
            <path d="M-6 -10 q-4 -6 0 -12 M6 -10 q-4 -6 0 -12" stroke="#c9bfb0" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M-26 10 Q0 18 26 10" stroke="#2f6fd6" strokeWidth="2.4" fill="none" />
          </g>
        </PingoFigure>
      )}
    />
  )
}

/* ---------- Groenlândia: sozinho no iceberg, aurora e um narval ---------- */
function Groenlandia() {
  return (
    <Stamp
      transform="translate(36 52) scale(0.58)"
      background={(
        <g>
          <rect width="140" height="170" fill="#1f2f4a" />
          <path d="M0 40 Q30 20 60 36 T140 30" stroke="#7bf0b4" strokeWidth="10" fill="none" opacity="0.45" />
          <path d="M0 54 Q40 34 80 50 T140 44" stroke="#9a7bf0" strokeWidth="7" fill="none" opacity="0.35" />
          {[[12, 12], [40, 8], [96, 14], [126, 22], [70, 18]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.2" fill="#fff" />)}
          <path d="M100 104 L108 70 L120 62 L132 74 L136 104 Z" fill="#e6f6fc" stroke="#8cc3dd" strokeWidth="1.2" />
          <path d="M24 122 L30 104 L44 98 L96 98 L106 106 L112 122 Z" fill="#f4fbfe" stroke="#8cc3dd" strokeWidth="1.4" />
          <rect y="118" width="140" height="52" fill="#2f5f86" />
          <path d="M0 118 q10 -4 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="#9fcbe0" strokeWidth="1.6" />
          <g transform="translate(10 126)">
            <path d="M0 10 Q2 -4 18 -4 Q34 -4 40 6 L50 0 L48 8 L52 14 L42 12 Q30 18 14 16 Q0 16 0 10 Z" fill="#8a9cb4" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M4 2 L-14 -18" stroke="#f1ece0" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M-12 -16 l3 -1 M-8 -11 l3 -1 M-4 -6 l3 -1" stroke="#c9bfb0" strokeWidth="1" />
            <circle cx="10" cy="4" r="1.5" fill={INK} />
            <path d="M8 9 q3 2 6 0" stroke={INK} strokeWidth="1" fill="none" />
            <circle cx="24" cy="4" r="1.2" fill="#6b7d96" />
            <circle cx="30" cy="8" r="1.2" fill="#6b7d96" />
          </g>
        </g>
      )}
      figure={(
        <PingoFigure flippers="right-up">
          <path d="M44 38 q5 -4 10 -1 M66 37 l10 1" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <g transform="translate(112 -2)">
            <path d="M-26 -14 Q-26 -24 -16 -24 L16 -24 Q26 -24 26 -14 L26 0 Q26 8 16 8 L-6 8 L-14 18 L-12 8 L-16 8 Q-26 8 -26 0 Z" fill="#fff" stroke={INK} strokeWidth="2" />
            <text x="0" y="-4" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily="'Bricolage Grotesque Variable', sans-serif">Oi?</text>
          </g>
        </PingoFigure>
      )}
    />
  )
}

/* ---------- Monte Everest: bandeira no topo do mundo ---------- */
function Everest() {
  return (
    <Stamp
      transform="translate(34 36) scale(0.62)"
      background={(
        <g>
          <Sky id="everest" top="#9fc4e8" bottom="#e8f2fa" />
          <path d="M-10 170 L40 60 L60 86 L82 40 L150 170 Z" fill="#8fa6c4" />
          <path d="M28 86 L40 60 L52 76 Z M70 64 L82 40 L96 66 L88 62 L82 68 L76 62 Z" fill="#fff" />
          <path d="M20 170 L70 108 L120 170 Z" fill="#a9bdd6" />
          <path d="M58 122 L70 108 L82 122 L76 120 L70 124 L64 120 Z" fill="#fff" />
          <g transform="translate(18 26)">
            <rect x="-14" y="-8" width="30" height="14" rx="2" fill="#fff8e6" stroke="#8a6a44" strokeWidth="1.2" />
            <text x="1" y="2" textAnchor="middle" fontSize="7" fontWeight="800" fill={INK} fontFamily="'Bricolage Grotesque Variable', sans-serif">8.849 m</text>
          </g>
        </g>
      )}
      figure={(
        <PingoFigure flippers="right-up" eyes="happy">
          <path d="M30 30 Q28 4 60 2 Q92 4 90 30 Q76 22 60 22 Q44 22 30 30 Z" fill="#e2574c" stroke={INK} strokeWidth="1.6" />
          <circle cx="60" cy="12" r="5" fill="#fff" stroke={INK} strokeWidth="1.2" />
          <path d="M36 64 Q60 80 84 64" stroke="#f6b93b" strokeWidth="5" fill="none" />
          <path d="M110 40 L112 -40" stroke="#8a6a44" strokeWidth="3.4" strokeLinecap="round" />
          <path d="M112 -40 L150 -32 L112 -22 Z" fill="#2f6fd6" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M120 -32 Q126 -36 132 -32 Q126 -28 120 -32 Z" fill="#fff" />
          <path d="M42 30 q3.4 5 0 7.6 q-3.4 -2.6 0 -7.6 z M79 31 q3 4.6 0 7 q-3 -2.4 0 -7 z" fill="#5aaee0" stroke="#fff" strokeWidth="0.8" />
        </PingoFigure>
      )}
    />
  )
}

/* ---------- Nova York: fantasiado de Estátua da Liberdade ---------- */
function NovaYork() {
  return (
    <Stamp
      background={(
        <g>
          <Sky id="nova-york" top="#cfe0f0" bottom="#f4f1ea" />
          <g fill="#9aa7b8">
            <rect x="0" y="50" width="18" height="70" />
            <rect x="20" y="30" width="14" height="90" />
            <path d="M24 30 V18 h6 V30 Z M27 18 V8" stroke="#9aa7b8" strokeWidth="1.4" />
            <rect x="104" y="40" width="16" height="80" />
            <rect x="122" y="56" width="18" height="64" />
          </g>
          <g fill="#f4f1ea" opacity="0.7">
            {[56, 66, 76, 86, 96].map((y) => <rect key={y} x="23" y={y} width="3" height="4" />)}
            {[50, 62, 74, 86, 98].map((y) => <rect key={y} x="108" y={y} width="3" height="4" />)}
          </g>
          <rect y="118" width="140" height="52" fill="#7d8590" />
          <path d="M0 140 h16 M28 140 h16 M56 140 h16 M84 140 h16 M112 140 h16" stroke="#f6e7b0" strokeWidth="2" />
          <Car x={92} y={146} color="#f6c445" scale={0.7} />
          <rect x="107" y="138" width="10" height="4" rx="1" fill={INK} />
        </g>
      )}
      figure={(
        <PingoFigure flippers="right-up" eyes="happy">
          <path d="M28 62 Q60 80 92 62 L96 104 Q60 120 24 104 Z" fill="#7cc4a8" opacity="0.92" />
          <path d="M36 74 Q46 96 40 110 M60 80 V114 M84 74 Q74 96 80 110" stroke="#5aa58a" strokeWidth="2" fill="none" />
          <path d="M34 22 Q60 12 86 22 L86 28 Q60 20 34 28 Z" fill="#7cc4a8" stroke={INK} strokeWidth="1.4" />
          {[[38, 22, -40], [48, 17, -20], [60, 15, 0], [72, 17, 20], [82, 22, 40]].map(([x, y, r]) => (
            <path key={`${x}`} d="M-3 0 L0 -12 L3 0 Z" transform={`translate(${x} ${y}) rotate(${r})`} fill="#7cc4a8" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
          ))}
          <path d="M108 40 L112 4" stroke="#7cc4a8" strokeWidth="6" strokeLinecap="round" />
          <path d="M104 6 L120 6 L116 -2 L108 -2 Z" fill="#7cc4a8" stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M112 -2 Q102 -12 110 -24 Q112 -14 116 -18 Q122 -10 112 -2 Z" fill="#f6b93b" stroke="#e2574c" strokeWidth="1.4" />
          <rect x="16" y="66" width="12" height="16" rx="2" fill="#7cc4a8" stroke={INK} strokeWidth="1.2" />
        </PingoFigure>
      )}
    />
  )
}

/* ---------- Polo Norte: só tem urso-polar. Corre! ---------- */
function PoloNorte() {
  return (
    <Stamp
      transform="translate(6 70) scale(0.56) rotate(-8 60 66)"
      background={(
        <g>
          <rect width="140" height="170" fill="#e3eef6" />
          {Array.from({ length: 16 }, (_, index) => <circle key={index} cx={((index * 43) % 136) + 2} cy={((index * 31) % 90) + 6} r="1.4" fill="#fff" />)}
          <rect y="104" width="140" height="66" fill="#fff" />
          <path d="M0 104 Q70 96 140 104" stroke="#cfe8f3" strokeWidth="2" fill="none" />
          <g transform="translate(76 54)">
            <rect x="-2" y="0" width="4" height="56" fill="#fff" stroke={INK} strokeWidth="1" />
            {[4, 16, 28, 40].map((y) => <rect key={y} x="-2" y={y} width="4" height="6" fill="#e2574c" />)}
            <rect x="-22" y="-12" width="44" height="12" rx="2" fill="#fff8e6" stroke="#8a6a44" strokeWidth="1.2" />
            <text x="0" y="-3" textAnchor="middle" fontSize="7" fontWeight="800" fill={INK} fontFamily="'Bricolage Grotesque Variable', sans-serif">POLO NORTE</text>
          </g>
          <g stroke="#a9a193" strokeWidth="1.3" strokeLinejoin="round" transform="translate(150 46) scale(-1.25 1.25)">
            <circle cx="6" cy="72" r="3" fill="#f7f4ec" />
            <rect x="8" y="78" width="7" height="12" rx="3.4" fill="#ece6d8" transform="rotate(25 11 78)" />
            <rect x="31" y="78" width="7" height="12" rx="3.4" fill="#ece6d8" transform="rotate(-25 34 78)" />
            <path d="M6 80 Q4 66 18 63 Q28 58 38 63 Q46 66 47 76 Q46 84 38 84 L14 84 Q6 84 6 80 Z" fill="#f7f4ec" />
            <rect x="14" y="78" width="7" height="13" rx="3.4" fill="#f7f4ec" transform="rotate(-30 17 78)" />
            <rect x="37" y="78" width="7" height="13" rx="3.4" fill="#f7f4ec" transform="rotate(30 40 78)" />
            <path d="M36 66 Q38 56 47 56 Q55 57 58 63 Q61 66 60 69 Q57 72 50 71 Q42 72 38 70 Z" fill="#f7f4ec" />
            <circle cx="42" cy="56.5" r="2.8" fill="#f7f4ec" />
            <circle cx="60" cy="66.5" r="1.9" fill={INK} stroke="none" />
            <circle cx="49.5" cy="61.5" r="1.4" fill={INK} stroke="none" />
            <path d="M52 70 q4 3 7 0" stroke="#e2574c" strokeWidth="1.4" fill="#ff9e9e" />
            <path d="M-8 64 h-8 M-6 72 h-12" stroke="#9fb6c6" strokeWidth="2" strokeLinecap="round" />
          </g>
        </g>
      )}
      figure={(
        <PingoFigure flippers="up">
          <circle cx="49" cy="46" r="6" fill="#fff" stroke={INK} strokeWidth="1.6" />
          <circle cx="71" cy="46" r="6" fill="#fff" stroke={INK} strokeWidth="1.6" />
          <circle cx="47" cy="46" r="2.6" fill={INK} />
          <circle cx="69" cy="46" r="2.6" fill={INK} />
          <path d="M42 30 q3.4 5 0 7.6 q-3.4 -2.6 0 -7.6 z M79 28 q3 4.6 0 7 q-3 -2.4 0 -7 z" fill="#5aaee0" stroke="#fff" strokeWidth="0.8" />
          <path d="M130 30 h20 M130 50 h26 M130 70 h18" stroke="#9fb6c6" strokeWidth="3" strokeLinecap="round" />
        </PingoFigure>
      )}
    />
  )
}

/* ---------- Polo Sul: selfie com os pinguins-imperadores ---------- */
function Emperor({ transform }: { transform: string }) {
  return (
    <g transform={transform}>
      <ellipse cx="60" cy="121" rx="30" ry="4" fill={INK} opacity="0.14" />
      <ellipse cx="48" cy="117" rx="9" ry="4.5" fill={INK} />
      <ellipse cx="72" cy="117" rx="9" ry="4.5" fill={INK} />
      <path d="M27 50 q-12 24 -8 54 q8 -6 12 -24 z M93 50 q12 24 8 54 q-8 -6 -12 -24 z" fill={INK} />
      <path d="M60 4 C84 4 94 34 94 66 C94 100 82 116 60 116 C38 116 26 100 26 66 C26 34 36 4 60 4 Z" fill={INK} />
      <path d="M60 40 C80 40 86 66 86 86 C86 104 74 112 60 112 C46 112 34 104 34 86 C34 66 40 40 60 40 Z" fill="#fff8e8" />
      <path d="M40 42 Q60 34 80 42 Q74 56 60 58 Q46 56 40 42 Z" fill="#fde7a8" />
      <path d="M30 26 Q36 36 42 40 Q38 28 34 22 Z M90 26 Q84 36 78 40 Q82 28 86 22 Z" fill="#f6b93b" />
      <circle cx="50" cy="26" r="3.6" fill="#fff" />
      <circle cx="70" cy="26" r="3.6" fill="#fff" />
      <circle cx="50" cy="26" r="2" fill={INK} />
      <circle cx="70" cy="26" r="2" fill={INK} />
      <path d="M56 30 L64 30 L60 44 Z" fill={INK} />
      <path d="M58 32 L62 32 L60 40 Z" fill="#f6a03b" />
    </g>
  )
}

function PoloSul() {
  return (
    <Stamp
      transform="translate(26 78) scale(0.5)"
      background={(
        <g>
          <rect width="140" height="170" fill="#dfeaf4" />
          <path d="M0 80 L30 60 L54 74 L84 54 L116 72 L140 62 V100 H0 Z" fill="#f4fbfe" stroke="#cfe8f3" strokeWidth="1.4" />
          <rect y="98" width="140" height="72" fill="#fff" />
          <g transform="translate(134 64)">
            <rect x="-2" y="0" width="4" height="58" fill="#fff" stroke={INK} strokeWidth="1" />
            {[6, 18, 30, 42].map((y) => <rect key={y} x="-2" y={y} width="4" height="6" fill="#e2574c" />)}
            <circle cx="0" cy="-5" r="6" fill="#cfd8e0" stroke={INK} strokeWidth="1.2" />
            <path d="M-3 -7 q2 -2 4 -1" stroke="#fff" strokeWidth="1.2" fill="none" />
          </g>
          <Emperor transform="translate(68 56) scale(0.66)" />
          <Emperor transform="translate(-14 94) scale(0.42)" />
        </g>
      )}
      figure={(
        <PingoFigure flippers="right-up" eyes="happy">
          <path d="M108 40 L134 -16" stroke="#5f6b78" strokeWidth="3" strokeLinecap="round" />
          <g transform="translate(136 -22) rotate(24)">
            <rect x="-8" y="-13" width="16" height="26" rx="3" fill={INK} />
            <rect x="-6" y="-10.4" width="12" height="20" rx="1.6" fill="#9fcbe0" />
          </g>
        </PingoFigure>
      )}
    />
  )
}

/* ---------- Havaí: surfando com colar de flores ---------- */
function Havai() {
  return (
    <Stamp
      transform="translate(30 46) scale(0.6) rotate(-8 60 66)"
      background={(
        <g>
          <Sky id="havai" top="#ffd2a8" bottom="#ffefd8" />
          <circle cx="108" cy="22" r="7" fill="#f8b13c" />
          <path d="M118.0 22.0 L122.0 22.0 M115.1 29.1 L117.9 31.9 M108.0 32.0 L108.0 36.0 M100.9 29.1 L98.1 31.9 M98.0 22.0 L94.0 22.0 M100.9 14.9 L98.1 12.1 M108.0 12.0 L108.0 8.0 M115.1 14.9 L117.9 12.1" stroke="#f8b13c" strokeWidth="2" strokeLinecap="round" />
          <path d="M0 70 L24 50 Q30 46 36 50 L60 70 Z" fill="#8a7a6a" />
          <path d="M28 48 q2 -6 4 0" stroke="#e2574c" strokeWidth="2" fill="none" />
          <g>
            <path d="M126 104 Q128 76 120 54" stroke="#8a6a44" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M120 54 q-12 -2 -18 6 M120 54 q12 -4 18 4 M120 54 q-8 -10 -16 -10 M120 54 q8 -10 16 -8" stroke="#5f8f4a" strokeWidth="4" fill="none" strokeLinecap="round" />
          </g>
          <rect y="68" width="140" height="102" fill="#5aaee0" />
          <path d="M0 150 Q10 100 50 92 Q90 86 110 120 Q96 108 80 112 Q100 124 104 150 Z" fill="#3f8fc8" />
          <path d="M50 92 Q90 86 110 120 Q96 108 80 112" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M0 150 q10 -5 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 V170 H0 Z" fill="#fff" opacity="0.9" />
        </g>
      )}
      figure={(
        <PingoFigure flippers="up" eyes="happy">
          <path d="M-8 126 Q60 104 128 120 Q132 128 120 130 Q60 138 -4 134 Q-14 130 -8 126 Z" fill="#f6b93b" stroke={INK} strokeWidth="2" />
          <path d="M4 128 Q60 116 116 124" stroke="#e2574c" strokeWidth="3" fill="none" />
          {[34, 42, 50, 58, 66, 74, 82].map((x, index) => (
            <circle key={x} cx={x} cy={66 + Math.sin((index / 6) * Math.PI) * 10} r="4.6" fill={['#ff7ad9', '#f6b93b', '#e2574c', '#fff'][index % 4]} stroke={INK} strokeWidth="0.8" />
          ))}
          <path d="M54 53 Q60 51 66 53 L60 58 Z" fill="#fff" />
        </PingoFigure>
      )}
    />
  )
}

/* ---------- Espaço ---------- */
function SpaceSky({ id }: { id: string }) {
  return (
    <g>
      <rect width="140" height="170" fill="#151f36" />
      {Array.from({ length: 34 }, (_, index) => (
        <circle key={`${id}-${index}`} cx={(index * 47) % 140} cy={(index * 71) % 170} r={index % 6 === 0 ? 1.4 : 0.8} fill="#fff" opacity={index % 3 === 0 ? 0.9 : 0.55} />
      ))}
    </g>
  )
}

/** Capacete de astronauta em volta da cabeça do Pingo (coordenadas do Pingo). */
function Helmet() {
  return (
    <g>
      <circle cx="60" cy="40" r="36" fill="#cde9f5" fillOpacity="0.1" stroke="#cfd8e0" strokeWidth="4" />
      <path d="M36 22 q8 -12 22 -14" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" fill="none" opacity="0.85" />
      <path d="M60 4 V-8" stroke="#cfd8e0" strokeWidth="2.4" />
      <circle cx="60" cy="-10" r="3.4" fill="#e2574c" />
    </g>
  )
}

function Lua() {
  return (
    <Stamp
      background={(
        <g>
          <SpaceSky id="lua" />
          <circle cx="110" cy="30" r="16" fill="#5aaee0" />
          <path d="M100 22 q6 -6 12 0 q2 6 -4 8 q-6 2 -8 -8 Z M112 34 q6 -2 8 4 q-4 4 -8 0 Z" fill="#7bc96f" />
          <path d="M0 118 Q40 104 80 112 Q110 106 140 114 V170 H0 Z" fill="#c9c6bd" />
          <ellipse cx="22" cy="138" rx="10" ry="3.4" fill="#a8a59c" />
          <ellipse cx="110" cy="150" rx="14" ry="4" fill="#a8a59c" />
          <ellipse cx="74" cy="160" rx="7" ry="2.4" fill="#a8a59c" />
        </g>
      )}
      figure={(
        <PingoFigure flippers="right-up" eyes="happy">
          <path d="M110 40 L112 -44" stroke="#cfd8e0" strokeWidth="3" strokeLinecap="round" />
          <path d="M112 -44 L150 -38 L112 -24 Z" fill="#ff8a3d" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M120 -34 Q126 -39 133 -34 Q126 -29 120 -34 Z M133 -34 l4 -3 v6 Z" fill="#fff" />
          <Helmet />
        </PingoFigure>
      )}
    />
  )
}

function Venus() {
  return (
    <Stamp
      background={(
        <g>
          <rect width="140" height="170" fill="#f3b45a" />
          <path d="M0 30 Q40 20 80 32 T140 28 M0 60 Q50 48 100 62 T140 58 M0 90 Q30 80 70 92 T140 86" stroke="#f8d48a" strokeWidth="9" fill="none" opacity="0.7" />
          <rect y="118" width="140" height="52" fill="#c8662f" />
          <path d="M10 124 q3 -4 0 -8 q-3 -4 0 -8 M128 120 q3 -4 0 -8 q-3 -4 0 -8" stroke="#ffe2a8" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      )}
      figure={(
        <PingoFigure flippers="up">
          <Helmet />
          {[[6, 34], [114, 34]].map(([x, y]) => (
            <g key={x} transform={`translate(${x} ${y})`}>
              <path d="M-7 4 L0 24 L7 4 Z" fill="#e0a663" stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
              <circle cx="0" cy="0" r="7" fill={x < 60 ? '#ff9ec0' : '#fff3c4'} stroke={INK} strokeWidth="1.4" />
              <path d="M-5 4 q0 8 -1 12 q2 1 3 -1 q0 -6 1 -9 Z M4 5 q1 6 0 10 q2 1 2.5 -1 q0 -5 -0.5 -8 Z" fill={x < 60 ? '#ff9ec0' : '#fff3c4'} />
            </g>
          ))}
          <path d="M42 30 q3.4 5 0 7.6 q-3.4 -2.6 0 -7.6 z M79 31 q3 4.6 0 7 q-3 -2.4 0 -7 z" fill="#5aaee0" stroke="#fff" strokeWidth="0.8" />
        </PingoFigure>
      )}
    />
  )
}

function Marte() {
  return (
    <Stamp
      background={(
        <g>
          <rect width="140" height="170" fill="#3a1f2a" />
          {Array.from({ length: 20 }, (_, index) => <circle key={index} cx={(index * 53) % 140} cy={(index * 37) % 90} r="0.9" fill="#fff" opacity="0.7" />)}
          <circle cx="26" cy="26" r="7" fill="#a08a7a" />
          <circle cx="112" cy="40" r="4" fill="#8a7a6a" />
          <path d="M0 108 Q30 90 70 102 Q104 92 140 104 V170 H0 Z" fill="#d0603e" />
          <path d="M0 132 Q50 120 100 132 Q124 128 140 132 V170 H0 Z" fill="#b84f30" />
          <g transform="translate(108 112)">
            <rect x="-14" y="-10" width="28" height="12" rx="2" fill="#cfd8e0" stroke={INK} strokeWidth="1.2" />
            <path d="M6 -10 V-20 h8" stroke={INK} strokeWidth="1.4" fill="none" />
            <circle cx="16" cy="-20" r="2.6" fill="#ff8a3d" stroke={INK} strokeWidth="1" />
            <circle cx="-9" cy="4" r="4" fill={INK} />
            <circle cx="0" cy="4" r="4" fill={INK} />
            <circle cx="9" cy="4" r="4" fill={INK} />
          </g>
        </g>
      )}
      figure={(
        <PingoFigure flippers="right-up" eyes="happy">
          <path d="M110 40 L112 -40" stroke="#cfd8e0" strokeWidth="3" strokeLinecap="round" />
          <path d="M112 -40 L146 -34 L112 -22 Z" fill="#fff" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
          <g transform="translate(124 -32) scale(0.18)">
            <path d="M60 10 C86 10 96 36 96 66 C96 98 82 116 60 116 C38 116 24 98 24 66 C24 36 34 10 60 10 Z" fill={INK} />
            <path d="M60 52 C78 52 84 72 84 88 C84 104 74 112 60 112 C46 112 36 104 36 88 C36 72 42 52 60 52 Z" fill="#fff" />
          </g>
          <Helmet />
        </PingoFigure>
      )}
    />
  )
}

function Sol() {
  return (
    <Stamp
      transform="translate(6 70) scale(0.6)"
      background={(
        <g>
          <SpaceSky id="sol" />
          <circle cx="132" cy="70" r="66" fill="#ffcf6e" opacity="0.3" />
          <path d={burstPath(132, 70, 62, 22)} fill="#f8b13c" />
          <circle cx="132" cy="70" r="52" fill="#ffd25a" />
          <circle cx="112" cy="56" r="6" fill="#f8b13c" />
          <circle cx="124" cy="94" r="4" fill="#f8b13c" />
        </g>
      )}
      figure={(
        <PingoFigure flippers="right-up">
          <rect x="38" y="38" width="20" height="12" rx="5" fill={INK} stroke="#ff8a3d" strokeWidth="2" />
          <rect x="62" y="38" width="20" height="12" rx="5" fill={INK} stroke="#ff8a3d" strokeWidth="2" />
          <path d="M58 43 h4" stroke="#ff8a3d" strokeWidth="2" />
          <path d="M56 54 Q60 52.6 64 54 L60 58 Z" fill="#fff" />
          <path d="M110 40 L150 10" stroke="#8a6a44" strokeWidth="3" strokeLinecap="round" />
          <g transform="translate(156 6) rotate(-36)">
            <path d="M-10 0 Q0 -7 10 0 Q0 7 -10 0 Z" fill="#c8662f" stroke={INK} strokeWidth="1.4" />
            <path d="M10 0 L17 -5 L15 0 L17 5 Z" fill="#c8662f" stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M-4 -3 l3 6 M2 -3 l3 6" stroke="#7a3a1e" strokeWidth="1.2" />
          </g>
          <path d="M160 -8 q3 -4 0 -8 M168 -2 q3 -4 0 -8" stroke="#c9bfb0" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <Helmet />
        </PingoFigure>
      )}
    />
  )
}

function Jupiter() {
  return (
    <Stamp
      transform="translate(52 96) scale(0.3)"
      background={(
        <g>
          <SpaceSky id="jupiter" />
          <circle cx="70" cy="74" r="62" fill="#d9a877" />
          <clipPath id="jupiter-clip"><circle cx="70" cy="74" r="62" /></clipPath>
          <g clipPath="url(#jupiter-clip)">
            {[24, 40, 58, 80, 98, 116].map((y, index) => <rect key={y} x="0" y={y} width="140" height={index % 2 === 0 ? 8 : 12} fill={index % 2 === 0 ? '#b8835a' : '#ecc79a'} />)}
            <ellipse cx="96" cy="96" rx="14" ry="8" fill="#c8662f" stroke="#a8502a" strokeWidth="1.2" />
          </g>
          <g transform="translate(70 150)">
            <rect x="-32" y="-8" width="64" height="14" rx="3" fill="#fff8e6" />
            <text x="0" y="2" textAnchor="middle" fontSize="6.4" fontWeight="800" fill={INK} fontFamily="'Bricolage Grotesque Variable', sans-serif">+ de 1.000 Terras</text>
          </g>
        </g>
      )}
      figure={(
        <PingoFigure flippers="up">
          <Helmet />
        </PingoFigure>
      )}
    />
  )
}

function Saturno() {
  return (
    <Stamp
      transform="translate(4 62) scale(0.46) rotate(-14 60 66)"
      background={(
        <g>
          <SpaceSky id="saturno" />
          <ellipse cx="70" cy="104" rx="66" ry="16" fill="none" stroke="#c9b48f" strokeWidth="6" />
          <circle cx="70" cy="104" r="36" fill="#e7cf94" />
          <path d="M40 92 h60 M36 104 h68 M40 116 h60" stroke="#d6b870" strokeWidth="4" />
          <path d="M4 104 A66 16 0 0 0 136 104" fill="none" stroke="#e7cf94" strokeWidth="9" />
          <path d="M4 104 A66 16 0 0 0 136 104" fill="none" stroke="#c9b48f" strokeWidth="2" />
          <path d="M20 110 q20 6 40 6" stroke="#fff" strokeWidth="1.6" fill="none" opacity="0.8" />
          <path d="M58 120 h14 M62 126 h12 M54 114 h10" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
        </g>
      )}
      figure={(
        <PingoFigure flippers="up">
          <circle cx="49" cy="46" r="6" fill="#fff" stroke={INK} strokeWidth="1.6" />
          <circle cx="71" cy="46" r="6" fill="#fff" stroke={INK} strokeWidth="1.6" />
          <circle cx="49" cy="44" r="2.6" fill={INK} />
          <circle cx="71" cy="44" r="2.6" fill={INK} />
          <path d="M32 122 h28 M64 122 h28" stroke="#cfd8e0" strokeWidth="3" strokeLinecap="round" />
          <path d="M34 114 v8 M86 114 v8" stroke="#2f6fd6" strokeWidth="6" strokeLinecap="round" />
          <Helmet />
        </PingoFigure>
      )}
    />
  )
}

function Netuno() {
  return (
    <Stamp
      background={(
        <g>
          <rect width="140" height="170" fill="#2b4fae" />
          <path d="M0 30 Q40 22 80 30 T140 26 M0 70 Q40 62 80 70 T140 66 M0 110 Q40 102 80 110 T140 106" stroke="#5b84e0" strokeWidth="8" fill="none" opacity="0.7" />
          {[[10, 40], [24, 84], [6, 120], [120, 50], [110, 96]].map(([x, y]) => (
            <path key={`${x}-${y}`} d={`M${x} ${y} h22 q6 0 6 -5`} stroke="#cfe0ff" strokeWidth="2" fill="none" strokeLinecap="round" />
          ))}
          <rect y="134" width="140" height="36" fill="#3d63c4" />
        </g>
      )}
      transform="translate(26 62) scale(0.7) rotate(10 60 120)"
      figure={(
        <PingoFigure flippers="left-up">
          <path d="M44 36 l10 4 M76 36 l-10 4" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M36 64 Q60 80 84 64 L84 72 Q60 86 36 72 Z" fill="#e2574c" />
          <path d="M84 66 Q110 60 136 70 Q118 74 108 80 Q122 82 132 92 Q108 88 86 74 Z" fill="#e2574c" />
          <path d="M93 64 q14 18 10 40 q-10 -8 -16 -24 z" fill={INK} />
          <Helmet />
        </PingoFigure>
      )}
    />
  )
}

function Plutao() {
  return (
    <Stamp
      transform="translate(10 64) scale(0.62)"
      background={(
        <g>
          <SpaceSky id="plutao" />
          <circle cx="102" cy="106" r="32" fill="#cdb9a6" stroke="#a8927e" strokeWidth="1.4" />
          <path d="M98 104 C88 92 80 106 98 120 C116 106 108 92 98 104 Z" fill="#f4ece0" />
          <circle cx="86" cy="94" r="3" fill="#b8a28e" />
          <circle cx="118" cy="118" r="4" fill="#b8a28e" />
          <path d="M102 60 q2 -6 6 -2 q4 -4 6 2 q-2 6 -6 8 q-4 -2 -6 -8 Z" fill="#ff7a9a" />
        </g>
      )}
      figure={(
        <PingoFigure flippers="right-up" eyes="happy">
          <Helmet />
        </PingoFigure>
      )}
    />
  )
}

function Proxima() {
  return (
    <Stamp
      transform="translate(22 50) scale(0.5) rotate(-24 60 66)"
      background={(
        <g>
          <rect width="140" height="170" fill="#151f36" />
          {Array.from({ length: 18 }, (_, index) => {
            const x = (index * 47) % 140
            const y = (index * 71) % 170
            return <path key={index} d={`M${x} ${y} l14 8`} stroke="#fff" strokeWidth="1.2" opacity="0.6" strokeLinecap="round" />
          })}
          <circle cx="116" cy="28" r="18" fill="#ff7b5c" opacity="0.35" />
          <circle cx="116" cy="28" r="12" fill="#ff7b5c" />
        </g>
      )}
      figure={(
        <g>
          <path d="M22 70 Q10 96 2 120 Q22 112 34 100 Z M98 70 Q110 96 118 120 Q98 112 86 100 Z" fill="#e2574c" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
          <path d="M30 120 Q60 160 90 120" fill="#ff8a3d" />
          <path d="M40 122 Q60 148 80 122" fill="#f6c445" />
          <path d="M60 -26 Q100 10 98 70 L96 120 Q60 128 24 120 L22 70 Q20 10 60 -26 Z" fill="#f1ece0" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M60 -26 Q78 -10 86 8 Q60 0 34 8 Q42 -10 60 -26 Z" fill="#e2574c" stroke={INK} strokeWidth="2" />
          <circle cx="60" cy="48" r="24" fill="#cde9f5" stroke="#5f6b78" strokeWidth="5" />
          <g transform="translate(36 22) scale(0.4)">
            <path d="M60 10 C86 10 96 36 96 66 C96 98 82 116 60 116 C38 116 24 98 24 66 C24 36 34 10 60 10 Z" fill={INK} />
            <path d="M38 33 Q48 24 60 30 Q72 24 82 33 Q84 48 76 56 Q60 66 44 56 Q36 48 38 33 Z" fill={BELLY} />
            <path d="M44 47 q5 -6 10 0 M66 47 q5 -6 10 0" stroke={INK} strokeWidth="3.2" fill="none" strokeLinecap="round" />
            <path d="M53 53 Q60 49 67 53 L60 61 Z" fill="#33414f" />
          </g>
          <path d="M24 92 H96" stroke="#2f6fd6" strokeWidth="5" />
        </g>
      )}
    />
  )
}

/* ---------- Gabão: chegou na África e um elefante deu banho nele ---------- */
function ElephantFront({ transform }: { transform: string }) {
  const SKIN = '#9aa3ad'
  return (
    <g transform={transform}>
      <ellipse cx="0" cy="30" rx="22" ry="18" fill={SKIN} {...OUTLINE} />
      <rect x="-16" y="40" width="10" height="14" rx="4" fill={SKIN} {...OUTLINE} />
      <rect x="6" y="40" width="10" height="14" rx="4" fill={SKIN} {...OUTLINE} />
      <path d="M-14 -6 Q-36 -14 -34 8 Q-30 22 -14 14 Z M14 -6 Q36 -14 34 8 Q30 22 14 14 Z" fill="#b5bcc4" {...OUTLINE} />
      <circle cx="0" cy="0" r="16" fill={SKIN} {...OUTLINE} />
      <path d="M-2 8 Q2 18 12 12 Q22 4 20 -16" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <path d="M-2 8 Q2 18 12 12 Q22 4 20 -16" fill="none" stroke={SKIN} strokeWidth="6.4" strokeLinecap="round" />
      <path d="M-8 10 l-6 6 M8 10 l6 6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <Eyes2 x={0} y={-4} gap={6} />
    </g>
  )
}

function Gabao() {
  return (
    <Stamp
      transform="translate(18 66) scale(0.6)"
      background={(
        <g>
          <Sky id="gabao" top="#cfe8f3" bottom="#f4f9fb" />
          <path d="M0 70 Q16 50 30 60 Q44 44 60 58 Q76 42 92 56 Q110 44 124 58 Q134 52 140 58 V92 H0 Z" fill="#4f8a4a" />
          <path d="M0 80 Q20 66 40 76 Q62 62 84 74 Q108 62 140 74 V96 H0 Z" fill="#5f9a54" />
          <rect y="92" width="140" height="22" fill="#9fcbe0" />
          <path d="M0 92 q10 -4 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="#fff" strokeWidth="1.6" />
          <rect y="112" width="140" height="58" fill="#f3dfb4" />
          <ElephantFront transform="translate(112 104) scale(0.78)" />
          <path d="M127 88 Q112 30 72 58" stroke="#9fcbe0" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="1 5" />
          <path d="M124 90 Q106 40 70 64" stroke="#cfe8f3" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeDasharray="1 6" />
          {[[70, 66], [62, 72], [76, 74], [66, 80], [80, 64]].map(([x, y]) => (
            <path key={`${x}-${y}`} d={`M${x} ${y} q2.4 3.6 0 5.4 q-2.4 -1.8 0 -5.4 z`} fill="#5aaee0" />
          ))}
        </g>
      )}
      figure={(
        <PingoFigure flippers="up" eyes="happy">
          <g transform="translate(112 28) rotate(10)">
            <circle cx="0" cy="6" r="12" fill="#8a5a2a" stroke={INK} strokeWidth="1.6" />
            <path d="M-12 2 Q0 -6 12 2 Q0 0 -12 2 Z" fill="#fff3c4" />
            <path d="M4 -2 L10 -20" stroke="#ff7ad9" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M-6 -4 Q0 -16 6 -4 Z" fill="#2f9e8f" stroke={INK} strokeWidth="1.2" />
          </g>
        </PingoFigure>
      )}
    />
  )
}

/* ---------- Santa Catarina (acerto!): Ponte Hercílio Luz e confete ---------- */
function SantaCatarina() {
  const confetti = ['#e2574c', '#f6c445', '#2f9e8f', '#5aaee0', '#ff7ad9']
  return (
    <Stamp
      transform="translate(32 64) scale(0.64)"
      background={(
        <g>
          <Sky id="sc" top="#bfe3f5" bottom="#f4f9fb" />
          <path d="M0 74 Q20 60 38 70 L38 92 H0 Z" fill="#7a9a5a" />
          <path d="M102 70 Q124 56 140 66 V92 H102 Z" fill="#7a9a5a" />
          <rect y="86" width="140" height="22" fill="#9fcbe0" />
          <g stroke="#5f6b78" fill="none">
            <path d="M8 86 H132" strokeWidth="3" />
            <path d="M44 86 V40 M96 86 V40" strokeWidth="3.4" />
            <path d="M8 84 Q26 60 44 40 Q70 80 96 40 Q114 60 132 84" strokeWidth="1.8" />
            {[52, 60, 70, 80, 88, 18, 28, 36, 104, 112, 122].map((x) => {
              const top = x < 44 ? 84 - ((x - 8) / 36) * 44 + Math.sin(((x - 8) / 36) * Math.PI) * 6 : x > 96 ? 40 + ((x - 96) / 36) * 44 - Math.sin(((x - 96) / 36) * Math.PI) * 6 : 40 + Math.sin(((x - 44) / 52) * Math.PI) * 40
              return <path key={x} d={`M${x} ${top} V86`} strokeWidth="0.9" />
            })}
          </g>
          <rect y="106" width="140" height="64" fill="#f3dfb4" />
          {Array.from({ length: 26 }, (_, index) => (
            <rect key={index} x={(index * 37) % 136} y={(index * 23) % 70} width="4" height="2.4" rx="0.6" fill={confetti[index % confetti.length]} transform={`rotate(${(index * 47) % 180} ${(index * 37) % 136} ${(index * 23) % 70})`} />
          ))}
        </g>
      )}
      figure={(
        <PingoFigure flippers="up" eyes="happy">
          <path d="M44 17 Q60 11 76 15 L62 -26 Z" fill="#2f9e8f" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
          <path d="M51 4 Q60 1 69 3 M55 -8 Q60 -10 65 -8" stroke="#f6b93b" strokeWidth="4" fill="none" />
          <circle cx="62" cy="-28" r="5.5" fill="#ff7a2f" stroke={INK} strokeWidth="2" />
          <path d="M110 40 V-10" stroke={INK} strokeWidth="3" strokeLinecap="round" />
          <path d="M110 -8 L140 3 L110 14 Z" fill="#ff7a2f" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
          <path d="M120 -2 l1.6 3.4 l3.6 0.4 l-2.7 2.5 l0.8 3.6 l-3.3 -1.9 l-3.2 1.9 l0.7 -3.6 l-2.6 -2.5 l3.6 -0.4 z" fill="#fff" />
        </PingoFigure>
      )}
    />
  )
}

/* ---------- Ilhas Malvinas: o Pingo leva um peixe para a Pinga ---------- */
function Heart({ x, y, size, color = '#ef5f7a' }: { x: number; y: number; size: number; color?: string }) {
  const k = size / 10
  return (
    <path
      transform={`translate(${x} ${y}) scale(${k})`}
      d="M0 3 C0 -2 -6 -4 -8 0 C-10 4 -6 8 0 12 C6 8 10 4 8 0 C6 -4 0 -2 0 3 Z"
      fill={color}
    />
  )
}

/** Bochechas rosadas (coordenadas do PingoFigure). */
const BLUSH = (
  <g fill="#ff8fa3" opacity="0.75">
    <ellipse cx="39" cy="55" rx="6" ry="3.4" />
    <ellipse cx="81" cy="55" rx="6" ry="3.4" />
  </g>
)

/** Peixe na nadadeira levantada (coordenadas do PingoFigure). */
const FISH = (
  <g transform="translate(116 30) rotate(-28)">
    <path d="M-18 0 Q-4 -12 14 0 Q-4 12 -18 0 Z" fill="#9fb8c8" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    <path d="M12 0 L26 -10 L24 0 L26 10 Z" fill="#9fb8c8" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    <path d="M-4 -7 Q0 0 -4 7" fill="none" stroke={INK} strokeWidth="1.6" />
    <circle cx="-11" cy="-2" r="2" fill={INK} />
  </g>
)

/** Flor das ilhas na cabeça da Pinga (coordenadas do PingoFigure). */
const FLOWER = (
  <g transform="translate(80 16)">
    {[0, 72, 144, 216, 288].map((angle) => (
      <ellipse key={angle} cx="0" cy="-8" rx="6" ry="8.5" fill="#ff8fb8" stroke={INK} strokeWidth="1.6" transform={`rotate(${angle})`} />
    ))}
    <circle r="5" fill="#f6c445" stroke={INK} strokeWidth="1.6" />
  </g>
)

/** Cachecol vermelho da Pinga (coordenadas do PingoFigure). */
const SCARF = (
  <g stroke={INK} strokeWidth="1.8" strokeLinejoin="round">
    <path d="M32 60 Q60 78 88 60 L90 70 Q60 90 30 70 Z" fill="#e2574c" />
    <path d="M70 76 L80 104 L68 104 L62 80 Z" fill="#e2574c" />
    <path d="M70 102 h10 M69 98 h10" stroke="#fff" strokeWidth="1.6" />
  </g>
)

/** A Pinga de flor na cabeça e cachecol vermelho, na porta da toca. */
function Malvinas() {
  return (
    <Stamp
      transform="translate(2 74) scale(0.5)"
      background={(
        <g>
          <Sky id="malvinas" top="#c3d6e4" bottom="#eef4f8" />
          <circle cx="112" cy="26" r="11" fill="#fff6dc" />
          <path d="M0 66 Q22 50 46 60 Q70 46 96 58 Q118 48 140 56 V84 H0 Z" fill="#8bb06a" />
          <rect y="80" width="140" height="16" fill="#7fb0cc" />
          <path d="M0 82 q10 -4 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="#fff" strokeWidth="1.4" opacity="0.9" />
          <path d="M0 96 Q40 88 80 94 T140 92 V170 H0 Z" fill="#a8cb84" />
          <path d="M0 150 Q50 140 100 148 T140 146 V170 H0 Z" fill="#efe6cf" />
          <path d="M84 132 Q90 94 118 92 Q142 92 146 132 Z" fill="#7fa35c" />
          <path d="M112 132 Q112 110 126 110 Q140 110 140 132 Z" fill="#3b2a1e" />
          <path d="M112 132 Q112 110 126 110 Q140 110 140 132" fill="none" stroke="#5f8443" strokeWidth="2.4" />
          {[[8, 104], [30, 114], [98, 108], [132, 112], [56, 104]].map(([x, y]) => (
            <path key={`${x}-${y}`} d={`M${x} ${y} l-3 -9 M${x} ${y} l0 -11 M${x} ${y} l3 -9`} stroke="#6c9450" strokeWidth="1.6" strokeLinecap="round" />
          ))}
          <g transform="translate(64 76) scale(0.5)">
            <PingoFigure eyes="happy" flippers="left-up">
              {BLUSH}
              {SCARF}
              {FLOWER}
            </PingoFigure>
          </g>
          <Heart x={66} y={70} size={9} />
          <Heart x={76} y={58} size={6} color="#ff8fa3" />
          <Heart x={58} y={52} size={5} color="#ff8fa3" />
        </g>
      )}
      figure={(
        <PingoFigure flippers="right-up" eyes="closed">
          {BLUSH}
          {FISH}
        </PingoFigure>
      )}
    />
  )
}

/** Cena de cada destino (id em destinations.ts). */
export const PLACE_SCENES: Readonly<Record<string, () => ReactNode>> = {
  lagos: Lagos,
  saara: Saara,
  nairobi: Nairobi,
  marrakech: Marrakech,
  cabo: CidadeDoCabo,
  cairo: Cairo,
  atenas: Atenas,
  madri: Madri,
  roma: Roma,
  madagascar: Madagascar,
  paris: Paris,
  londres: Londres,
  dubai: Dubai,
  berlim: Berlim,
  moscou: Moscou,
  groenlandia: Groenlandia,
  everest: Everest,
  'nova-york': NovaYork,
  'polo-norte': PoloNorte,
  'polo-sul': PoloSul,
  havai: Havai,
  gabao: Gabao,
  'santa-catarina': SantaCatarina,
  lua: Lua,
  venus: Venus,
  marte: Marte,
  sol: Sol,
  jupiter: Jupiter,
  saturno: Saturno,
  netuno: Netuno,
  plutao: Plutao,
  proxima: Proxima,
  toquio: Toquio,
  'los-angeles': LosAngeles,
  alasca: Anchorage,
  seul: Seul,
  mexico: Mexico,
  pequim: Pequim,
  singapura: Singapura,
  malvinas: Malvinas,
}
