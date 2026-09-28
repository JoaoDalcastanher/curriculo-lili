import React, { useCallback, useMemo } from "react";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import type { OptionsObject } from "notistack";

export const SNACKBAR_AUTO_HIDE_DURATION = 4000;

type ShowSnackbarFn = (message: string, overrides?: OptionsObject) => void;

let globalShowSnackbar: ShowSnackbarFn | null = null;

export function registerSnackbarHandler(handler: ShowSnackbarFn | null): void {
  globalShowSnackbar = handler;
}

export function getGlobalSnackbar(): ShowSnackbarFn | null {
  return globalShowSnackbar;
}

export function SnackbarUtilsConfigurator(): React.ReactElement {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const baseOptions = useMemo(
    () => getSnackbarOptions(closeSnackbar),
    [closeSnackbar],
  );

  React.useEffect(() => {
    registerSnackbarHandler((message, overrides) => {
      enqueueSnackbar(message, { ...baseOptions, ...overrides });
    });
    return () => {
      globalShowSnackbar = null;
    };
  }, [enqueueSnackbar, baseOptions]);

  return <></>;
}

export const SNACKBAR_ANCHOR_ORIGIN = {
  vertical: "bottom" as const,
  horizontal: "center" as const,
};

export type SnackbarCloseFn = (key: string | number) => void;

export function getSnackbarOptions(closeSnackbar: SnackbarCloseFn): OptionsObject {
  return {
    autoHideDuration: SNACKBAR_AUTO_HIDE_DURATION,
    anchorOrigin: SNACKBAR_ANCHOR_ORIGIN,
    action: (snackbarId) => (
      <IconButton
        size="small"
        color="inherit"
        onClick={() => closeSnackbar(snackbarId)}
        aria-label="Fechar"
      >
        <Close fontSize="small" />
      </IconButton>
    ),
  };
}

export function useConfiguredSnackbar() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const baseOptions = useMemo(
    () => getSnackbarOptions(closeSnackbar),
    [closeSnackbar],
  );

  const showSnackbar = useCallback(
    (message: string, overrides?: OptionsObject) => {
      enqueueSnackbar(message, { ...baseOptions, ...overrides });
    },
    [enqueueSnackbar, baseOptions],
  );

  return { showSnackbar };
}
