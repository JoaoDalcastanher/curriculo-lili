// Hand-drawn decorative shapes. Purely visual: aria-hidden, fixed intrinsic sizes
// (ADR-0006 exception for decorations).

import { Box } from "@mui/material";
import { keyframes } from "@mui/material/styles";

import type { DecorationPlacement, DecorationShape } from "@/models/homeUi";

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(var(--rot, 0deg)); }
  50% { transform: translateY(-10px) rotate(calc(var(--rot, 0deg) + 6deg)); }
`;

type DecorationProps = {
  shape: DecorationShape;
  color: string;
  size: number;
  rotate?: number;
  sx?: DecorationPlacement;
};

function ShapeSvg({ shape, color }: Pick<DecorationProps, "shape" | "color">) {
  switch (shape) {
    case "circle":
      return <circle cx="50" cy="50" r="46" fill={color} />;
    case "ring":
      return <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="9" />;
    case "star":
      return (
        <path
          d="M50 4 L61 38 L96 38 L68 59 L79 94 L50 72 L21 94 L32 59 L4 38 L39 38 Z"
          fill={color}
          stroke={color}
          strokeWidth="6"
          strokeLinejoin="round"
        />
      );
    case "squiggle":
      return (
        <path
          d="M4 60 Q 17 30 30 60 T 56 60 T 82 60 T 108 60"
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
        />
      );
    case "dots":
      return (
        <g fill={color}>
          {[0, 1, 2].flatMap((row) =>
            [0, 1, 2].map((col) => (
              <circle key={`${row}-${col}`} cx={18 + col * 32} cy={18 + row * 32} r="8" />
            )),
          )}
        </g>
      );
  }
}

export function Decoration({ shape, color, size, rotate = 0, sx }: DecorationProps) {
  const viewBox = shape === "squiggle" ? "0 0 112 100" : "0 0 100 100";
  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        width: size,
        height: size,
        pointerEvents: "none",
        "--rot": `${rotate}deg`,
        transform: `rotate(${rotate}deg)`,
        animation: `${float} 7s ease-in-out infinite`,
        ...sx,
      }}
    >
      <svg viewBox={viewBox} width="100%" height="100%" overflow="visible">
        <ShapeSvg shape={shape} color={color} />
      </svg>
    </Box>
  );
}
