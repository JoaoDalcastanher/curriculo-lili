import { clearCsrfCache } from "@/services/api";
import { getGlobalSnackbar } from "@/utils/snackbarUtils";

function getErrorMessage(error: unknown): string {
  const err = error as {
    message?: string;
    data?: { message?: string; httpStatus?: number };
    cause?: { message?: string };
  };
  return (
    err?.message ?? err?.data?.message ?? err?.cause?.message ?? ""
  ).toLowerCase();
}

function getHttpStatus(error: unknown): number | undefined {
  const err = error as {
    data?: { httpStatus?: number };
    cause?: { status?: number };
  };
  return err?.data?.httpStatus ?? err?.cause?.status;
}

export function isCsrfError(error: unknown): boolean {
  const message = getErrorMessage(error);
  const status = getHttpStatus(error);
  if (status !== undefined && status !== 403) return false;
  return message.includes("csrf");
}

export function handleCsrfError(error: unknown): boolean {
  if (!isCsrfError(error)) return false;
  clearCsrfCache();
  const snackbar = getGlobalSnackbar();
  if (snackbar) {
    snackbar("Token de sessão expirado. Tente novamente.", { variant: "error" });
  }
  return true;
}

/** Wraps a mutation onError handler to silently skip CSRF errors — the tRPC client already retries and shows the snackbar. */
export function withCsrfSkip<TError = Error>(
  handler: (error: TError) => void,
): (error: TError) => void {
  return (error: TError) => {
    if (isCsrfError(error)) return;
    handler(error);
  };
}
