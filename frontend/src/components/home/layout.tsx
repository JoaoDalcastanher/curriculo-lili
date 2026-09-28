// Shared building blocks: page container, section shell and section header.

import { Box } from "@mui/material";
import type { ReactNode } from "react";

import type { SectionId } from "@/models/homeUi";
import { fonts, layout, palette } from "@/theme/theme";

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        position: "relative",
        zIndex: 1,
        maxWidth: layout.maxWidth,
        mx: "auto",
        px: layout.gutter,
      }}
    >
      {children}
    </Box>
  );
}

type SectionProps = {
  id: SectionId;
  label: string;
  background?: string;
  color?: string;
  children: ReactNode;
};

export function Section({ id, label, background, color, children }: SectionProps) {
  return (
    <Box
      component="section"
      id={id}
      aria-label={label}
      sx={{
        position: "relative",
        overflow: "clip",
        scrollMarginTop: layout.headerHeight,
        py: layout.sectionPadding,
        backgroundColor: background,
        color,
      }}
    >
      {children}
    </Box>
  );
}

export const displayTitleSx = {
  m: 0,
  fontFamily: fonts.display,
  fontWeight: 700,
  fontSize: "clamp(3.25rem,9vw,6.5rem)",
  lineHeight: 0.95,
  letterSpacing: "-0.045em",
} as const;

export const leadSx = {
  m: 0,
  maxWidth: "30rem",
  fontFamily: fonts.display,
  fontWeight: 500,
  fontSize: "clamp(1.25rem,2.2vw,1.55rem)",
  lineHeight: 1.3,
  letterSpacing: "-0.01em",
  textWrap: "pretty",
} as const;

type SectionHeaderProps = {
  title: string;
  lead?: string;
  tone?: "dark" | "light";
};

export function SectionHeader({ title, lead, tone = "dark" }: SectionHeaderProps) {
  const isLight = tone === "light";
  return (
    <Box
      data-reveal=""
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,20rem),1fr))",
        gap: "1rem 3rem",
        alignItems: "end",
        pt: "1.25rem",
        borderTop: `2px solid ${isLight ? palette.white : palette.ink}`,
      }}
    >
      <Box component="h2" sx={{ ...displayTitleSx, color: isLight ? palette.white : palette.ink }}>
        {title}
      </Box>
      {lead !== undefined && (
        <Box component="p" sx={{ ...leadSx, color: isLight ? palette.mint : palette.green }}>
          {lead}
        </Box>
      )}
    </Box>
  );
}
