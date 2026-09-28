/// <reference types="vite/client" />
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";

import { profile } from "@/content/profile";
import { FONTS_STYLESHEET_URL, palette, theme } from "@/theme/theme";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${profile.name} · ${profile.title}` },
      { name: "description", content: profile.tagline },
      { name: "theme-color", content: palette.paper },
      { property: "og:title", content: `${profile.name} · ${profile.title}` },
      { property: "og:description", content: profile.tagline },
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
        <HeadContent />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Outlet />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
