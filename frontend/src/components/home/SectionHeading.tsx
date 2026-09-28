import { Stack, Typography } from "@mui/material";

import type { SectionHeadingProps } from "@/models/homeUi";
import { fonts, palette } from "@/theme/theme";

export function SectionHeading({
  eyebrow,
  title,
  align = "left",
  tone = "dark",
}: SectionHeadingProps) {
  const isLight = tone === "light";
  return (
    <Stack spacing={1.5} alignItems={align === "center" ? "center" : "flex-start"}>
      <Typography
        sx={{
          fontFamily: fonts.hand,
          fontSize: { xs: "1.6rem", md: "1.9rem" },
          lineHeight: 1,
          color: isLight ? palette.mustardSoft : palette.terracotta,
          transform: "rotate(-2deg)",
        }}
      >
        {eyebrow}
      </Typography>
      <Typography
        variant="h2"
        component="h2"
        sx={{
          textAlign: align,
          color: isLight ? palette.white : palette.ink,
          maxWidth: "18ch",
        }}
      >
        {title}
      </Typography>
    </Stack>
  );
}
