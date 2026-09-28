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
      // Add real routes here once the page list is known — keeps prerendering accurate.
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
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 4173,
    host: "0.0.0.0",
  },
});
