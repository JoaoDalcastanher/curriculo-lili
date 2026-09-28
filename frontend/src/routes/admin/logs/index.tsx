// Admin page: external-call structured log viewer (ADR-0013).
//
// Reads trpc.logs.listExternalCalls (admin-gated). Every outbound HTTP call made through
// backend/src/utils/httpClient.ts logs one row per retry attempt — hence the "Tentativa"
// column, which has no analogue in a one-entry-per-call system.
//
// NOTE: the endpoint is admin-gated. Until this project wires a real login that populates
// session.userId, the query returns UNAUTHORIZED and the table shows the error state. That
// is the intended handoff point documented in ADR-0013.

import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import {
  type CellContext,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";

import { trpc } from "@/lib/trpc";
import {
  EMPTY_LOG_FILTERS,
  type ExternalCallLogFilters,
  type ExternalCallLogRow,
} from "@/models/logUi";
import { copyToClipboard } from "@/utils/clipboard";

const BODY_TRUNCATE_LEN = 120;
const PAGE_SIZE_OPTIONS = [20, 50, 100];

function stringOrUndefined(value: string): string | undefined {
  return value.length > 0 ? value : undefined;
}

function getFullBody(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "[não serializável]";
  }
}

function formatBody(value: unknown): string {
  const full = getFullBody(value);
  if (full.length === 0) {
    return "-";
  }
  return full.length > BODY_TRUNCATE_LEN ? `${full.slice(0, BODY_TRUNCATE_LEN)}...` : full;
}

function BodyCell({
  value,
  title,
  onExpand,
}: {
  value: unknown;
  title: string;
  onExpand: (content: string, title: string) => void;
}) {
  const full = getFullBody(value);
  const hasContent = full.length > 0;

  const handleCopy = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      void copyToClipboard(full);
    },
    [full],
  );

  const handleClick = useCallback(() => {
    if (hasContent) {
      onExpand(full, title);
    }
  }, [hasContent, full, onExpand, title]);

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 0.5,
        maxWidth: { xs: 140, sm: 220, md: 300 },
        cursor: hasContent ? "pointer" : "default",
      }}
    >
      <Typography
        component="code"
        sx={{
          fontFamily: "monospace",
          fontSize: 11,
          wordBreak: "break-all",
          flex: 1,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {formatBody(value)}
      </Typography>
      {hasContent ? (
        <IconButton
          size="small"
          onClick={handleCopy}
          aria-label="Copiar"
          sx={{ minWidth: 28, minHeight: 28 }}
        >
          <ContentCopyIcon sx={{ fontSize: 14 }} />
        </IconButton>
      ) : null}
    </Box>
  );
}

const columnHelper = createColumnHelper<ExternalCallLogRow>();

function buildColumns(onExpand: (content: string, title: string) => void) {
  return [
    columnHelper.accessor("timestamp", {
      header: "Data/Hora",
      cell: (info: CellContext<ExternalCallLogRow, string>) => (
        <Typography component="code" sx={{ fontFamily: "monospace", fontSize: 11 }}>
          {info.getValue()}
        </Typography>
      ),
    }),
    columnHelper.accessor("requestId", {
      header: "Request ID",
      cell: (info: CellContext<ExternalCallLogRow, string | null>) => (
        <Typography component="code" sx={{ fontFamily: "monospace", fontSize: 12 }}>
          {info.getValue() ?? "-"}
        </Typography>
      ),
    }),
    columnHelper.accessor("attempt", {
      header: "Tentativa",
      cell: (info: CellContext<ExternalCallLogRow, number>) => (
        <Typography component="code" sx={{ fontFamily: "monospace", fontSize: 12 }}>
          {info.getValue()}
        </Typography>
      ),
    }),
    columnHelper.accessor("method", {
      header: "Método",
      cell: (info: CellContext<ExternalCallLogRow, string>) => (
        <Typography
          component="code"
          sx={{ fontFamily: "monospace", fontSize: 12, fontWeight: 600 }}
        >
          {info.getValue()}
        </Typography>
      ),
    }),
    columnHelper.accessor("endpoint", {
      header: "Endpoint",
      cell: (info: CellContext<ExternalCallLogRow, string>) => (
        <Typography sx={{ fontSize: 12, wordBreak: "break-all" }}>{info.getValue()}</Typography>
      ),
    }),
    columnHelper.accessor("requestedBody", {
      header: "Request Body",
      cell: (info: CellContext<ExternalCallLogRow, unknown>) => (
        <BodyCell value={info.getValue()} title="Request Body" onExpand={onExpand} />
      ),
    }),
    columnHelper.accessor("responseBody", {
      header: "Response Body",
      cell: (info: CellContext<ExternalCallLogRow, unknown>) => (
        <BodyCell value={info.getValue()} title="Response Body" onExpand={onExpand} />
      ),
    }),
    columnHelper.accessor("wasSuccessful", {
      header: "Status",
      cell: (info: CellContext<ExternalCallLogRow, boolean>) =>
        info.getValue() ? (
          <Chip
            icon={<CheckCircleIcon />}
            label="OK"
            size="small"
            color="success"
            variant="outlined"
          />
        ) : (
          <Chip icon={<CancelIcon />} label="Erro" size="small" color="error" variant="outlined" />
        ),
    }),
  ];
}

function LogsTable({
  rows,
  onExpand,
}: {
  rows: ExternalCallLogRow[];
  onExpand: (content: string, title: string) => void;
}) {
  const columns = useMemo(() => buildColumns(onExpand), [onExpand]);
  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <TableContainer sx={{ "& .MuiTableCell-root": { py: 0.75, px: 1 } }}>
      <Table
        size="small"
        sx={{
          minWidth: 800,
          "& th": {
            fontWeight: 600,
            fontSize: 12,
            backgroundColor: "primary.main",
            color: "primary.contrastText",
          },
        }}
      >
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell key={header.id}>
                  {flexRender(
                    header.column.columnDef.header as React.ReactNode,
                    header.getContext(),
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell as React.ReactNode, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function LogsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [inputs, setInputs] = useState<ExternalCallLogFilters>(EMPTY_LOG_FILTERS);
  const [applied, setApplied] = useState<ExternalCallLogFilters>(EMPTY_LOG_FILTERS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");

  const query = trpc.logs.listExternalCalls.useQuery({
    page,
    pageSize,
    dataInicio: stringOrUndefined(applied.dataInicio),
    dataFim: stringOrUndefined(applied.dataFim),
    requestId: stringOrUndefined(applied.requestId),
    endpoint: stringOrUndefined(applied.endpoint),
    apenasErros: applied.apenasErros ? true : undefined,
  });

  const rows: ExternalCallLogRow[] = query.data?.entries ?? [];
  const total = query.data?.total ?? 0;
  const endpointOptions = query.data?.endpoints ?? [];

  const handleExpand = useCallback((content: string, title: string) => {
    setDialogContent(content);
    setDialogTitle(title);
    setDialogOpen(true);
  }, []);

  const handleFilter = useCallback(() => {
    setApplied(inputs);
    setPage(1);
  }, [inputs]);

  const handleToggleErrors = useCallback(
    (checked: boolean) => {
      const next = { ...inputs, apenasErros: checked };
      setInputs(next);
      setApplied(next);
      setPage(1);
    },
    [inputs],
  );

  const updateInput = useCallback((patch: Partial<ExternalCallLogFilters>) => {
    setInputs((prev) => ({ ...prev, ...patch }));
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Logs de chamadas externas
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Cada tentativa de chamada externa (incluindo retentativas) é registrada. Credenciais são
        redigidas automaticamente.
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
          mb: 2,
        }}
      >
        <TextField
          size="small"
          label="Data início"
          type="datetime-local"
          value={inputs.dataInicio}
          onChange={(event) => updateInput({ dataInicio: event.target.value })}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 200 }}
        />
        <TextField
          size="small"
          label="Data fim"
          type="datetime-local"
          value={inputs.dataFim}
          onChange={(event) => updateInput({ dataFim: event.target.value })}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 200 }}
        />
        <TextField
          size="small"
          label="Request ID"
          placeholder="Buscar por ID"
          value={inputs.requestId}
          onChange={(event) => updateInput({ requestId: event.target.value })}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleFilter();
            }
          }}
          sx={{ minWidth: 160 }}
        />
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel>Endpoint</InputLabel>
          <Select
            value={inputs.endpoint}
            label="Endpoint"
            onChange={(event) => updateInput({ endpoint: event.target.value })}
          >
            <MenuItem value="">Todos</MenuItem>
            {endpointOptions.map((endpoint) => (
              <MenuItem key={endpoint} value={endpoint}>
                {endpoint}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControlLabel
          control={
            <Switch
              checked={inputs.apenasErros}
              onChange={(_, checked) => handleToggleErrors(checked)}
              color="primary"
            />
          }
          label="Somente erros"
        />
        <Button variant="contained" onClick={handleFilter} startIcon={<SearchIcon />}>
          Filtrar
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            void query.refetch();
          }}
          disabled={query.isFetching}
          startIcon={
            query.isFetching ? <CircularProgress size={18} color="inherit" /> : <RefreshIcon />
          }
        >
          Recarregar
        </Button>
      </Box>

      <Paper sx={{ p: 2 }}>
        {query.isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : null}

        {query.isError ? (
          <Typography color="error" sx={{ py: 4 }}>
            Não foi possível carregar os logs: {query.error.message}
          </Typography>
        ) : null}

        {!query.isLoading && !query.isError && rows.length === 0 ? (
          <Typography sx={{ color: "text.secondary", py: 4 }}>
            Nenhum log encontrado para o filtro selecionado.
          </Typography>
        ) : null}

        {!query.isError && rows.length > 0 ? (
          <>
            <LogsTable rows={rows} onExpand={handleExpand} />
            <TablePagination
              component="div"
              count={total}
              page={page - 1}
              onPageChange={(_, nextPage) => setPage(nextPage + 1)}
              rowsPerPage={pageSize}
              onRowsPerPageChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(1);
              }}
              rowsPerPageOptions={PAGE_SIZE_OPTIONS}
              labelRowsPerPage="Por página:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />
          </>
        ) : null}
      </Paper>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { maxHeight: "80vh" } }}
      >
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <Typography
            component="pre"
            sx={{
              fontFamily: "monospace",
              fontSize: 12,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              overflow: "auto",
              maxHeight: "60vh",
            }}
          >
            {dialogContent.length > 0 ? dialogContent : "-"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<ContentCopyIcon />}
            onClick={() => void copyToClipboard(dialogContent)}
          >
            Copiar
          </Button>
          <Button variant="contained" onClick={() => setDialogOpen(false)}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export const Route = createFileRoute("/admin/logs/")({ component: LogsPage });
