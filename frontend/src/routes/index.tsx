import { createFileRoute, Link } from "@tanstack/react-router";
import { Box, Button, Container, Stack, Typography } from "@mui/material";

export const Route = createFileRoute("/")({
  component: HomePage,
});

// SUBSTITUA — esta é uma landing page provisória do template base.
// Construa a homepage real aqui assim que a primeira feature do projeto existir.
function HomePage() {
  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, sm: 8 } }}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1">
          O template base está rodando
        </Typography>
        <Typography variant="body1" color="text.secondary">
          O frontend (TanStack Start) está conectado ao backend (Bun + tRPC) através
          desta página. Substitua-a pela homepage real assim que a primeira feature existir.
        </Typography>
        <Box>
          <Button component={Link} to="/example" variant="contained">
            Ver a página de exemplo do tRPC
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}
