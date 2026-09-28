// Reusable UI types for the home page sections (Policy 002).

import type { ReactNode } from "react";

export type SectionId = "sobre" | "trajetoria" | "formacao" | "contato";

export type NavItem = {
  id: SectionId;
  label: string;
};

export type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
};

export type DecorationShape = "circle" | "star" | "squiggle" | "dots" | "ring";

type Offset = number | string;
type ResponsiveOffset = Offset | Partial<Record<"xs" | "sm" | "md" | "lg", Offset>>;

/** Absolute placement of a decorative shape inside its (relative) parent. */
export type DecorationPlacement = {
  top?: ResponsiveOffset;
  right?: ResponsiveOffset;
  bottom?: ResponsiveOffset;
  left?: ResponsiveOffset;
  zIndex?: number;
  opacity?: number;
};
