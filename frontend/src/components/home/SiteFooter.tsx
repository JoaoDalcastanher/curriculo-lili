import { Box } from "@mui/material";

import { layout, palette } from "@/theme/theme";

type SiteFooterProps = {
  fullName: string;
  year: number;
};

export function SiteFooter({ fullName, year }: SiteFooterProps) {
  return (
    <Box
      component="footer"
      sx={{
        maxWidth: layout.maxWidth,
        mx: "auto",
        p: `1.75rem ${layout.gutter} 2.5rem`,
        textAlign: "center",
        fontWeight: 600,
        fontSize: "0.95rem",
        color: palette.muted,
      }}
    >
      {`© ${year} ${fullName}`}
    </Box>
  );
}
