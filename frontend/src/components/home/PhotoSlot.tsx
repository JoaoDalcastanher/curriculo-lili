// A photo that fills its (positioned) parent. Without a `src` it shows a soft
// placeholder with the hint, so the layout reads well before real photos exist.

import { Box } from "@mui/material";

import type { Photo } from "@/models/profile";
import { palette } from "@/theme/theme";

type PhotoSlotProps = {
  photo: Photo;
  eager?: boolean;
};

export function PhotoSlot({ photo, eager = false }: PhotoSlotProps) {
  if (photo.src !== null) {
    return (
      <Box
        component="img"
        src={photo.src}
        alt={photo.alt}
        loading={eager ? "eager" : "lazy"}
        sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  }
  return (
    <Box
      role="img"
      aria-label={photo.alt}
      sx={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.4rem",
        p: "0.75rem",
        textAlign: "center",
        color: palette.muted,
        backgroundImage:
          "repeating-linear-gradient(135deg, transparent 0 14px, rgba(59,98,85,0.05) 14px 28px)",
      }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ opacity: 0.55 }}
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
      <Box
        component="span"
        aria-hidden="true"
        sx={{ fontSize: "0.85rem", fontWeight: 600, maxWidth: "90%" }}
      >
        {photo.hint}
      </Box>
    </Box>
  );
}
