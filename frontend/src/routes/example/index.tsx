// EXAMPLE PAGE — delete this file when implementing real features.
//
// This page demonstrates:
//   - trpc.<router>.<procedure>.useQuery()    → reading data
//   - trpc.<router>.<procedure>.useMutation() → writing data
//
// TanStack Router picks this up automatically as the route for /example/

import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { trpc } from "../../lib/trpc";

function ExamplePage() {
  const [name, setName] = useState("");

  // useQuery — fetches data, re-fetches when the component mounts or the key changes.
  const { data, isLoading, refetch } = trpc.example.list.useQuery();

  // useMutation — call .mutate() to trigger the server procedure.
  const createMutation = trpc.example.create.useMutation({
    onSuccess: () => {
      setName("");
      refetch();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      return;
    }
    createMutation.mutate({ name: name.trim() });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Página de exemplo — apague isto
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Esta página é scaffolding. Veja o README.md para o checklist de limpeza.
      </Typography>

      {createMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {createMutation.error.message}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}
      >
        <TextField
          fullWidth
          label="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={createMutation.isPending}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={createMutation.isPending || !name.trim()}
        >
          {createMutation.isPending ? "Criando..." : "Criar"}
        </Button>
      </Box>

      <List>
        {data?.items.map((item) => (
          <ListItem key={item.id} divider>
            <ListItemText
              primary={item.name}
              secondary={item.description ?? new Date(item.createdAt).toLocaleDateString()}
            />
          </ListItem>
        ))}
        {data?.items.length === 0 && (
          <ListItem>
            <ListItemText secondary="Nenhum item ainda. Crie um acima." />
          </ListItem>
        )}
      </List>
    </Box>
  );
}

export const Route = createFileRoute("/example/")({ component: ExamplePage });
