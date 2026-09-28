// Visual identity: warm paper, deep ink, terracotta and sage — a cozy classroom feel.
// Provisional until the final design arrives; every color lives here.

import { createTheme, responsiveFontSizes } from "@mui/material/styles";

export const palette = {
  paper: "#FBF6EE",
  paperDeep: "#F3EADB",
  ink: "#1E2A3B",
  inkSoft: "#4A5568",
  terracotta: "#D2643F",
  terracottaSoft: "#F4C9B5",
  sage: "#6F9A7C",
  sageSoft: "#CFE3D4",
  mustard: "#E7B24C",
  mustardSoft: "#F8E3B4",
  sky: "#8BB6D6",
  white: "#FFFFFF",
} as const;

export const fonts = {
  display: '"Fraunces", "Georgia", serif',
  body: '"Nunito", "Helvetica Neue", Arial, sans-serif',
  hand: '"Caveat", "Comic Sans MS", cursive',
} as const;

export const FONTS_STYLESHEET_URL =
  "https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,800;1,9..144,400;1,9..144,600&family=Nunito:wght@400;600;700;800&display=swap";

const baseTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: palette.terracotta, contrastText: palette.white },
    secondary: { main: palette.sage, contrastText: palette.white },
    background: { default: palette.paper, paper: palette.white },
    text: { primary: palette.ink, secondary: palette.inkSoft },
  },
  shape: { borderRadius: 20 },
  typography: {
    fontFamily: fonts.body,
    h1: { fontFamily: fonts.display, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 0.95 },
    h2: { fontFamily: fonts.display, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.05 },
    h3: { fontFamily: fonts.display, fontWeight: 600, letterSpacing: "-0.01em" },
    h4: { fontFamily: fonts.display, fontWeight: 600 },
    h5: { fontFamily: fonts.display, fontWeight: 600 },
    h6: { fontWeight: 800 },
    body1: { fontSize: "1.075rem", lineHeight: 1.75 },
    overline: { fontWeight: 800, letterSpacing: "0.18em" },
    button: { textTransform: "none", fontWeight: 800 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { scrollBehavior: "smooth" },
        body: { backgroundColor: palette.paper },
        "::selection": { backgroundColor: palette.mustardSoft },
        "@media (prefers-reduced-motion: reduce)": {
          html: { scrollBehavior: "auto" },
          "*, *::before, *::after": {
            animationDuration: "0.01ms !important",
            transitionDuration: "0.01ms !important",
          },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: "999px", paddingInline: 24, paddingBlock: 12 } },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 700, borderRadius: 999 } },
    },
  },
});

export const theme = responsiveFontSizes(baseTheme, { factor: 2.4 });
