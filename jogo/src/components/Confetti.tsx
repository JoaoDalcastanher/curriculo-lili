import { useMemo, type CSSProperties } from 'react'

type PieceStyle = CSSProperties & { '--drift': string; '--spin': string }

const COLORS = ['#ff8a3d', '#2f9e8f', '#f6c445', '#5aaee0', '#e2574c']

type Piece = { left: number; delay: number; drift: number; spin: number; color: string; wide: boolean }

/** Chuva de confete curta, disparada uma vez quando o Pingo chega. */
export function Confetti() {
  const pieces = useMemo<Piece[]>(
    () => Array.from({ length: 90 }, (_, index) => ({
      left: (index * 37) % 100,
      delay: (index % 12) * 110,
      drift: ((index * 53) % 160) - 80,
      spin: ((index * 97) % 720) - 360,
      color: COLORS[index % COLORS.length],
      wide: index % 3 === 0,
    })),
    [],
  )

  return (
    <div className="confetti" aria-hidden="true" data-testid="confete">
      {pieces.map((piece, index) => {
        const style: PieceStyle = {
          left: `${piece.left}%`,
          background: piece.color,
          animationDelay: `${piece.delay}ms`,
          '--drift': `${piece.drift}px`,
          '--spin': `${piece.spin}deg`,
        }
        return <span key={index} className={piece.wide ? 'confetti-piece is-wide' : 'confetti-piece'} style={style} />
      })}
    </div>
  )
}
