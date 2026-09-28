// EXAMPLE ROUTER — delete this file when implementing real features.
//
// Rules:
// - Validate input with Zod, call one service method, return the result.
// - No business logic here (ADR-0003).
// - Use publicProcedure for unauthenticated endpoints, protectedProcedure for authenticated ones.

import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { exampleService } from "../services/example.service";

export const exampleRouter = router({
  // Query — reads data. Maps to useQuery() on the frontend.
  list: publicProcedure
    .input(
      z
        .object({
          page: z.number().int().positive().default(1),
          pageSize: z.number().int().min(1).max(100).default(20),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      return exampleService.list(input?.page, input?.pageSize);
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ input }) => {
      return exampleService.getById(input.id);
    }),

  // Mutation — writes data. Maps to useMutation() on the frontend.
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        description: z.string().max(1000).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return exampleService.create(input);
    }),
});
