import { Box } from "@mui/material";
import { useState } from "react";

import type { NavItem } from "@/models/homeUi";
import { fonts, layout, palette } from "@/theme/theme";

type SiteHeaderProps = {
  name: string;
  items: NavItem[];
};

const WIDE = "@media (min-width:860px)";

const navLinkSx = {
  fontWeight: 700,
  fontSize: "0.98rem",
  color: palette.ink,
  py: "0.4rem",
  borderBottom: "2px solid transparent",
  transition: "border-color 0.25s, color 0.25s",
  "&:hover": { color: palette.green, borderColor: palette.sun },
} as const;

const ctaLinkSx = {
  px: "1.2rem",
  py: "0.7rem",
  borderRadius: "0.6rem",
  fontWeight: 800,
  fontSize: "0.98rem",
  color: palette.white,
  backgroundColor: palette.green,
  transition: "background 0.25s, transform 0.25s",
  "&:hover": { backgroundColor: palette.ink, color: palette.white, transform: "translateY(-2px)" },
} as const;

export function SiteHeader({ name, items }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const lastIndex = items.length - 1;

  return (
    <Box
      component="header"
      sx={{
        position: "fixed",
        inset: "0 0 auto 0",
        zIndex: 50,
        backgroundColor: palette.headerGlass,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      <Box
        sx={{
          maxWidth: layout.maxWidth,
          mx: "auto",
          px: layout.gutter,
          height: layout.headerHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <Box
          component="a"
          href="#inicio"
          sx={{
            fontFamily: fonts.display,
            fontWeight: 800,
            fontSize: "1.65rem",
            letterSpacing: "-0.035em",
            color: palette.ink,
          }}
        >
          {name}
          <Box component="span" sx={{ color: palette.coral }}>
            .
          </Box>
        </Box>
        <Box
          component="nav"
          aria-label="Seções"
          sx={{ display: "none", alignItems: "center", gap: "2rem", [WIDE]: { display: "flex" } }}
        >
          {items.map((item, index) => (
            <Box
              key={item.id}
              component="a"
              href={`#${item.id}`}
              sx={index === lastIndex ? ctaLinkSx : navLinkSx}
            >
              {item.label}
            </Box>
          ))}
        </Box>
        <Box
          component="button"
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="menu-celular"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            minHeight: "2.75rem",
            px: "0.25rem",
            border: 0,
            borderBottom: `2px solid ${palette.sun}`,
            background: "transparent",
            color: palette.ink,
            font: "inherit",
            fontWeight: 800,
            fontSize: "1rem",
            cursor: "pointer",
            [WIDE]: { display: "none" },
          }}
        >
          {menuOpen ? "Fechar" : "Menu"}
        </Box>
      </Box>
      {menuOpen && (
        <Box
          id="menu-celular"
          component="nav"
          aria-label="Menu"
          sx={{
            maxWidth: layout.maxWidth,
            mx: "auto",
            p: `0.5rem ${layout.gutter} 1.5rem`,
            display: "flex",
            flexDirection: "column",
            [WIDE]: { display: "none" },
          }}
        >
          {items.map((item, index) => (
            <Box
              key={item.id}
              component="a"
              href={`#${item.id}`}
              onClick={closeMenu}
              sx={{
                py: "1rem",
                borderTop: `1px solid rgba(34,51,44,0.14)`,
                borderBottom: index === lastIndex ? `1px solid rgba(34,51,44,0.14)` : undefined,
                fontFamily: fonts.display,
                fontWeight: 600,
                fontSize: "1.5rem",
                color: index === lastIndex ? palette.green : palette.ink,
              }}
            >
              {item.label}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
