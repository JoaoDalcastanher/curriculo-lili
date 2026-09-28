/// <reference types="vite/client" />
import { CssBaseline, GlobalStyles, ThemeProvider } from "@mui/material";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";

import { MOTION_BOOT_SCRIPT, motionHiddenStyles } from "@/animation/motionFlags";
import { profile } from "@/content/profile";
import { FONTS_STYLESHEET_URL, palette, theme } from "@/theme/theme";

const pageTitle = `${profile.name} · ${profile.title}`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: pageTitle },
      { name: "description", content: profile.hero.tagline },
      { name: "theme-color", content: palette.paper },
      { property: "og:title", content: pageTitle },
      { property: "og:description", content: profile.hero.tagline },
      { property: "og:type", content: "profile" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: FONTS_STYLESHEET_URL },
    ],
  }),
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT_SCRIPT }} />
        <HeadContent />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <GlobalStyles styles={motionHiddenStyles} />
          <Outlet />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
