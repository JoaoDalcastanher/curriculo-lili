/// <reference types="vite/client" />
import React from "react";
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { trpc, createTRPCClient } from "@/lib/trpc";
import { queryClient } from "@/utils/queryClient";
import {
  SNACKBAR_AUTO_HIDE_DURATION,
  SNACKBAR_ANCHOR_ORIGIN,
  SnackbarUtilsConfigurator,
} from "@/utils/snackbarUtils";

const NotistackProvider = SnackbarProvider as unknown as React.ComponentType<{
  maxSnack?: number;
  autoHideDuration?: number;
  anchorOrigin?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
  };
  children: React.ReactNode;
}>;

const trpcClient = createTRPCClient();

function TRPCProviders({ children }: { children: React.ReactNode }) {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      {children}
    </trpc.Provider>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "[Nome do Projeto]" },
    ],
    links: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  }),
  component: RootComponent,
});

function RootComponent() {
  return <RootDocument />;
}

function RootDocument() {
  return (
    <html lang="pt-BR" style={{ height: "100%" }} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body style={{ height: "100%", margin: 0, display: "flex", flexDirection: "column" }}>
        <QueryClientProvider client={queryClient}>
          <TRPCProviders>
            <NotistackProvider
              maxSnack={3}
              autoHideDuration={SNACKBAR_AUTO_HIDE_DURATION}
              anchorOrigin={SNACKBAR_ANCHOR_ORIGIN}
            >
              <SnackbarUtilsConfigurator />
              <Outlet />
              {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
            </NotistackProvider>
          </TRPCProviders>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
