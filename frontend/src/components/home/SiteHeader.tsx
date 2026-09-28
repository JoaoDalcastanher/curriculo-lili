import { Box, Button, Container, Stack, Typography } from "@mui/material";

import type { NavItem } from "@/models/homeUi";
import { fonts, palette } from "@/theme/theme";

type SiteHeaderProps = {
  name: string;
  items: NavItem[];
};

export function SiteHeader({ name, items }: SiteHeaderProps) {
  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        backdropFilter: "blur(12px)",
        backgroundColor: "rgba(251, 246, 238, 0.78)",
        borderBottom: `1px solid ${palette.paperDeep}`,
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ py: 1.5, gap: 2 }}
        >
          <Typography
            component="a"
            href="#inicio"
            sx={{
              fontFamily: fonts.hand,
              fontSize: "2.1rem",
              fontWeight: 700,
              color: palette.ink,
              textDecoration: "none",
              lineHeight: 1,
            }}
          >
            {name}
            <Box component="span" sx={{ color: palette.terracotta }}>
              .
            </Box>
          </Typography>
          <Stack
            component="nav"
            aria-label="Seções"
            direction="row"
            spacing={0.5}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {items.map((item) => (
              <Button
                key={item.id}
                href={`#${item.id}`}
                sx={{
                  color: palette.ink,
                  "&:hover": { backgroundColor: palette.paperDeep },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
          <Button
            variant="contained"
            href="#contato"
            sx={{ display: { xs: "inline-flex", md: "none" } }}
          >
            Contato
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
