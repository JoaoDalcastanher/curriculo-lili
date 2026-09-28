import { Container, Stack, Typography } from "@mui/material";

import { fonts, palette } from "@/theme/theme";

type SiteFooterProps = {
  fullName: string;
  year: number;
};

export function SiteFooter({ fullName, year }: SiteFooterProps) {
  return (
    <Container component="footer" maxWidth="lg" sx={{ py: 5 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        sx={{ color: palette.inkSoft }}
      >
        <Typography sx={{ fontSize: "0.95rem" }}>{`© ${year} ${fullName}`}</Typography>
        <Typography sx={{ fontFamily: fonts.hand, fontSize: "1.4rem" }}>
          feito com carinho 💛
        </Typography>
      </Stack>
    </Container>
  );
}
