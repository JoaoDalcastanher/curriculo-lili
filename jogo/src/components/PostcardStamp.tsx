import type { PenguinMood } from '../game/types'
import { Penguin } from './Penguin'
import { PLACE_SCENES } from './scenes/PlaceScenes'

type PostcardStampProps = {
  mood: PenguinMood
  sceneId?: string
  /** Cor de fundo do selo quando não há cena própria. */
  tone: string
  /** Terra bem longe no horizonte (antes do objetivo). */
  far?: boolean
  label?: string
}

/** O selo do cartão-postal: a cena do lugar, ou o Pingo com o humor da viagem. */
export function PostcardStamp({ mood, sceneId, tone, far = false, label }: PostcardStampProps) {
  const PlaceScene = sceneId ? PLACE_SCENES[sceneId] : undefined
  const inWater = mood === 'pensativo' && !PlaceScene
  const onBoardwalk = !PlaceScene && (mood === 'carioca' || mood === 'canguru')
  return (
    <div className={`postcard-stamp ${tone}${inWater ? ' is-horizon' : ''}${onBoardwalk ? ' is-scene' : ''}${PlaceScene ? ' is-place' : ''}${['cansado', 'exausto', 'calor'].includes(mood) ? ' is-beach' : ''}`} aria-hidden="true">
      {mood === 'pensativo' && (
        <svg className="postcard-horizon" viewBox="0 0 140 170" preserveAspectRatio="xMidYMid slice">
          <rect width="140" height="170" fill="#eaf4f8" />
          <circle cx="112" cy="34" r="12" fill="#ffe2a8" />
          {far && (
            <g>
              <path d="M88 80 Q104 74 118 77 Q128 74 140 76 V84 H88 Z" fill="#dcebc4" />
              <path d="M88 80 Q104 74 118 77 Q128 74 140 76" fill="none" stroke="#86b46c" strokeWidth="1.5" />
              <path d="M116 69 l1.2 2.5 l2.8 0.3 l-2 1.9 l0.5 2.8 l-2.5 -1.4 l-2.5 1.4 l0.5 -2.8 l-2 -1.9 l2.8 -0.3 z" fill="#f6b93b" stroke="#c98a12" strokeWidth="0.8" />
            </g>
          )}
          {!far && (
            <g>
              <path d="M30 78 Q60 64 92 70 Q118 62 140 70 V96 H30 Z" fill="#dcebc4" />
              <path d="M30 78 Q60 64 92 70 Q118 62 140 70" fill="none" stroke="#86b46c" strokeWidth="2" />
              <path d="M96 58 l2 4.2 l4.6 0.5 l-3.4 3.1 l0.9 4.6 l-4.1 -2.4 l-4.1 2.4 l0.9 -4.6 l-3.4 -3.1 l4.6 -0.5 z" fill="#f6b93b" stroke="#c98a12" strokeWidth="1" />
            </g>
          )}
          <rect y="80" width="140" height="90" fill="#cfe8f3" />
          <path d="M8 96 q6 -4 12 0 M104 92 q6 -4 12 0 M60 102 q6 -4 12 0" stroke="#9fcbe0" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      )}
      {mood === 'canguru' && (
        <svg className="postcard-horizon" viewBox="0 0 140 170" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="outback-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffd9a0" />
              <stop offset="100%" stopColor="#ffb878" />
            </linearGradient>
          </defs>
          <rect width="140" height="170" fill="url(#outback-sky)" />
          <circle cx="108" cy="30" r="13" fill="#fff1c9" />
          <path d="M26 96 Q30 74 50 72 Q86 70 100 76 Q112 82 114 96 Z" fill="#b9532f" />
          <path d="M40 80 Q60 76 92 79" stroke="#9a4426" strokeWidth="1.5" fill="none" />
          <path d="M52 90 v-8 M70 92 v-10 M86 90 v-8" stroke="#9a4426" strokeWidth="1.2" />
          <rect y="94" width="140" height="76" fill="#d9773f" />
          <path d="M0 110 Q40 104 80 112 T140 108 V170 H0 Z" fill="#c8662f" />
          <path d="M14 96 V70" stroke="#7a5a3a" strokeWidth="3" strokeLinecap="round" />
          <circle cx="10" cy="66" r="7" fill="#7a9a5a" />
          <circle cx="18" cy="62" r="8" fill="#8aab68" />
          <circle cx="14" cy="56" r="6" fill="#7a9a5a" />
          <path d="M120 112 l3 -6 l3 6 M128 116 l2 -5 l2 5 M30 124 l3 -6 l3 6" stroke="#8aab68" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </svg>
      )}
      {mood === 'carioca' && (
        <svg className="postcard-horizon" viewBox="0 0 140 170" preserveAspectRatio="xMidYMid slice">
          <rect width="140" height="170" fill="#eaf4f8" />
          <path d="M84 70 Q92 34 106 32 Q118 36 122 70 Z" fill="#8fbf7a" />
          <path d="M60 70 Q66 52 76 52 Q84 56 86 70 Z" fill="#a5cf8f" />
          <rect y="66" width="140" height="22" fill="#9fcbe0" />
          <rect y="88" width="140" height="10" fill="#f3dfb4" />
          <rect y="98" width="140" height="72" fill="#fffaf0" />
          <path d="M-10 112 q10 -10 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 M-10 132 q10 -10 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 M-10 152 q10 -10 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="#1c2733" strokeWidth="5" />
        </svg>
      )}
      {PlaceScene && <PlaceScene />}
      {!PlaceScene && <Penguin mood={mood} size={inWater ? 78 : 112} />}
      {inWater && (
        <svg className="postcard-water" viewBox="0 0 140 40" preserveAspectRatio="none">
          <path d="M0 10 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 V40 H0 Z" fill="#b9dced" opacity="0.95" />
          <path d="M0 10 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="#fff" strokeWidth="2" opacity="0.8" />
        </svg>
      )}
      {label && <span className="postcard-stamp-value">{label}</span>}
    </div>
  )
}
