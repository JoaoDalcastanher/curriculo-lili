// Visual identity from the Claude Design handoff (Gabrieli.dc.html).
// Green (#3B6255, shared with the presente-de-noivado project) leads; warm
// accents bring the joy. Every color and font of the site lives here.

import { createTheme } from "@mui/material/styles";

export const palette = {
  paper: "#F7F5F1",
  paperDeep: "#EFEDE7",
  white: "#FFFFFF",
  offWhite: "#FBFAF6",
  ink: "#22332C",
  inkHover: "#26392F",
  muted: "#51655C",
  green: "#3B6255",
  mint: "#CBDED3",
  mintHover: "#BCD4C6",
  sun: "#F2B83A",
  sunHover: "#EFAE25",
  coral: "#F07B5E",
  peach: "#F6B8A6",
  peachHover: "#F4AA96",
  sand: "#D2C49E",
  sandHover: "#C9B98E",
  hairline: "rgba(34,51,44,0.18)",
  hairlineSoft: "rgba(34,51,44,0.12)",
  headerGlass: "rgba(247,245,241,0.88)",
  backdrop: "rgba(34,51,44,0.6)",
} as const;

export const fonts = {
  display: "'Bricolage Grotesque', system-ui, sans-serif",
  body: "'Nunito', system-ui, sans-serif",
  hand: "'Caveat', cursive",
} as const;

export const FONTS_STYLESHEET_URL =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Caveat:wght@600;700&family=Nunito:wght@400;600;700;800&display=swap";

/** Shared easing curves (cubic-bezier) used by CSS transitions and Motion. */
export const easing = {
  out: [0.22, 1, 0.36, 1],
  morph: [0.32, 0.72, 0, 1],
  count: [0.16, 1, 0.3, 1],
} as const;

export const transitionOut = "cubic-bezier(.22,1,.36,1)";

/** Page gutter and content width, reused by every section. */
export const layout = {
  maxWidth: "76rem",
  gutter: "clamp(1.25rem,5vw,3rem)",
  headerHeight: "4.5rem",
  sectionPadding: "clamp(4.5rem,10vw,8rem)",
} as const;

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: palette.green, contrastText: palette.white },
    secondary: { main: palette.sun, contrastText: palette.ink },
    background: { default: palette.paper, paper: palette.white },
    text: { primary: palette.ink, secondary: palette.muted },
  },
  typography: { fontFamily: fonts.body },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { scrollBehavior: "smooth" },
        body: {
          backgroundColor: palette.paper,
          color: palette.ink,
          overflowX: "clip",
          WebkitFontSmoothing: "antialiased",
        },
        a: { color: palette.green, textDecoration: "none" },
        "a:hover": { color: palette.ink },
        "::selection": { backgroundColor: palette.sun, color: palette.ink },
        ":focus-visible": { outline: `3px solid ${palette.sun}`, outlineOffset: "2px" },
        "@media (prefers-reduced-motion: reduce)": {
          html: { scrollBehavior: "auto" },
          "*": { transition: "none !important", animation: "none !important" },
        },
      },
    },
  },
});
