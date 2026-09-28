// Structured external-call log router (ADR-0013).
//
// Admin-gated: uses createAdminProcedure so log contents are never exposed to unauthenticated
// callers. NOTE: the template ships no login flow that populates session.userId, so until a
// derived repo wires real authentication this endpoint returns UNAUTHORIZED and /admin/logs
// shows no data. That handoff is intentional and documented in ADR-0013.

import { z } from "zod";

import { logsService } from "../services/logs.service";
import { createAdminProcedure, router } from "../trpc";

const adminLogsProcedure = createAdminProcedure("admin.logs.read");

export const logsRouter = router({
  listExternalCalls: adminLogsProcedure
    .input(
      z
        .object({
          page: z.number().int().positive().default(1),
          pageSize: z.number().int().min(1).max(100).default(50),
          endpoint: z.string().optional(),
          requestId: z.string().optional(),
          dataInicio: z.string().optional(),
          dataFim: z.string().optional(),
          apenasErros: z.boolean().optional(),
        })
        .optional(),
    )
    .query(({ input }) => {
      return logsService.listExternalCalls(input ?? {});
    }),
});
