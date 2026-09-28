import path from "path";
import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

const isProduction = process.env.NODE_ENV === "production";

// Material UI ships ESM that the SSR bundler should not externalize in production builds.
const muiNoExternal = [
  ...(isProduction
    ? [
        "@mui/icons-material",
        "@mui/material",
        "@mui/utils",
        "@mui/styled-engine",
        "@mui/system",
        "@emotion/react",
        "@emotion/styled",
      ]
    : []),
];

// Static site (ADR-0014): every page is prerendered to plain HTML at build time into
// dist/client, which `server.ts` serves on Railway. No backend, no runtime SSR.
export default defineConfig({
  ssr: {
    noExternal: muiNoExternal,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "@tanstack/react-router"],
  },
  plugins: [
    tsConfigPaths({
      projects: [path.resolve(__dirname, "./tsconfig.json")],
    }) as PluginOption,
    tanstackStart({
      prerender: { enabled: true, crawlLinks: true },
      pages: [{ path: "/" }],
    }) as PluginOption,
    react() as PluginOption,
  ],
  build: {
    sourcemap: false,
  },
  server: {
    port: 3000,
    strictPort: true,
  },
});
