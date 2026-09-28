import { createTRPCReact } from "@trpc/react-query";
import {
  createTRPCClient as createTRPCVanillaClient,
  httpLink,
} from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "../../../backend/src/routers";
import { getCsrfToken, clearCsrfCache } from "@/services/api";

// If you set up a workspace package alias for the backend (e.g. "@app/backend"),
// update the AppRouter import above accordingly.

const getBaseURL = (): string => {
  const envUrl = (import.meta as { env?: Record<string, string> }).env?.VITE_API_URL;
  if (envUrl) return envUrl;
  if ((import.meta as { env?: Record<string, string> }).env?.SSR) return "http://localhost:3001/api";
  return "/api";
};

export const trpc = createTRPCReact<AppRouter>();

function createTrpcClientConfig() {
  return {
    links: [
      httpLink({
        url: `${getBaseURL()}/trpc`,
        transformer: superjson,
        async fetch(url, options) {
          const method = options?.method?.toUpperCase() ?? "GET";
          const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(method);

          const response = await fetch(url, { ...options, credentials: "include" });

          // Transparent single-use CSRF retry (ADR-0012)
          if (response.status === 403) {
            const text = await response.clone().text();
            if (text.toLowerCase().includes("csrf")) {
              clearCsrfCache();
              const freshToken = await getCsrfToken();
              const retryHeaders = new Headers(options?.headers);
              retryHeaders.set("x-csrf-token", freshToken);

              const retryResponse = await fetch(url, {
                ...options,
                headers: retryHeaders,
                credentials: "include",
              });

              if (isMutation) clearCsrfCache();

              if (retryResponse.status === 403) {
                const { getGlobalSnackbar } = await import("@/utils/snackbarUtils");
                const snackbar = getGlobalSnackbar();
                if (snackbar) {
                  snackbar("Token de sessão expirado. Tente novamente.", { variant: "error" });
                }
              }

              return retryResponse;
            }
          }

          if (isMutation) clearCsrfCache();
          return response;
        },
        async headers() {
          const token = await getCsrfToken();
          return { "x-csrf-token": token ?? "" };
        },
      }),
    ],
  };
}

export function createTRPCClient() {
  return trpc.createClient(createTrpcClientConfig());
}

let trpcVanillaClient: ReturnType<typeof createTRPCVanillaClient<AppRouter>> | null = null;

/**
 * Vanilla tRPC client for use inside React Query queryFn callbacks.
 * Use when you want React Query to remain the outer layer and tRPC
 * to power the type-safe API call inside.
 */
export function getTrpcClient(): ReturnType<typeof createTRPCVanillaClient<AppRouter>> {
  if (!trpcVanillaClient) {
    trpcVanillaClient = createTRPCVanillaClient<AppRouter>(createTrpcClientConfig());
  }
  return trpcVanillaClient;
}
