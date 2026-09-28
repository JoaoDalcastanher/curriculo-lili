// Decorative floating shapes. Purely visual (aria-hidden); the outer layer
// takes the scroll parallax, the inner one the idle float (HomeMotion).

import { Box } from "@mui/material";

import type { ShapeKind, ShapePlacement } from "@/models/homeUi";

type ShapeProps = {
  kind: ShapeKind;
  color: string;
  /** Rendered size, e.g. "2.25rem". Squiggles use it as width. */
  size: string;
  placement: ShapePlacement;
  parallax?: number;
};

const SPARKLE_PATH = "M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z";
const SQUIGGLE_PATH = "M2 12 C 12 2, 22 2, 32 12 S 52 22, 62 12 S 82 2, 92 12 S 112 22, 118 12";

function ShapeBody({ kind, color, size }: Pick<ShapeProps, "kind" | "color" | "size">) {
  switch (kind) {
    case "sparkle":
      return (
        <Box data-float="" sx={{ width: size, height: size }}>
          <svg viewBox="0 0 24 24" width="100%" height="100%">
            <path d={SPARKLE_PATH} fill={color} />
          </svg>
        </Box>
      );
    case "squiggle":
      return (
        <Box data-float="">
          <Box
            component="svg"
            viewBox="0 0 120 24"
            sx={{
              width: size,
              height: `calc(${size} * 0.22)`,
              display: "block",
              overflow: "visible",
            }}
          >
            <path
              d={SQUIGGLE_PATH}
              fill="none"
              stroke={color}
              strokeWidth="4.5"
              strokeLinecap="round"
            />
          </Box>
        </Box>
      );
    case "dot":
      return (
        <Box
          data-float=""
          sx={{ width: size, height: size, borderRadius: "50%", backgroundColor: color }}
        />
      );
  }
}

export function Shape({ kind, color, size, placement, parallax }: ShapeProps) {
  return (
    <Box
      aria-hidden="true"
      data-parallax={parallax}
      sx={{ position: "absolute", zIndex: 0, pointerEvents: "none", ...placement }}
    >
      <ShapeBody kind={kind} color={color} size={size} />
    </Box>
  );
}
