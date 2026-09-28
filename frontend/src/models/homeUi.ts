// Reusable UI types for the home page (Policy 002).

export type SectionId = "inicio" | "sobre" | "trajetoria" | "projetos" | "formacao" | "contato";

export type NavItem = {
  id: SectionId;
  label: string;
};

/** A project filter chip: a tag, or the "all" option (`tag: null`). */
export type ProjectFilter = {
  label: string;
  tag: string | null;
};

export type ShapeKind = "sparkle" | "squiggle" | "dot";

type Offset = string | Partial<Record<"xs" | "sm" | "md", string>>;

/** Absolute placement of a decorative shape inside its (relative) section. */
export type ShapePlacement = {
  top?: Offset;
  right?: Offset;
  bottom?: Offset;
  left?: Offset;
};
