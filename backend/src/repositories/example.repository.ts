// EXAMPLE REPOSITORY — delete this file when implementing real features.
//
// Rules:
// - This is the only layer that imports and uses the Prisma client (ADR-0003).
// - All methods return named model types, never raw Prisma types (ADR-0005).
// - No business logic lives here — only data access.

import type { IExampleRepository } from "./interfaces";
import type { ExampleItem, CreateExampleInput, PaginatedResult } from "../model/example";
import { prisma } from "../lib/prisma";

export class ExampleRepository implements IExampleRepository {
  async list(take: number, skip: number): Promise<PaginatedResult<ExampleItem>> {
    const [items, total] = await Promise.all([
      prisma.example.findMany({ take, skip, orderBy: { createdAt: "desc" } }),
      prisma.example.count(),
    ]);
    return { items, total };
  }

  async findById(id: string): Promise<ExampleItem | null> {
    return prisma.example.findUnique({ where: { id } });
  }

  async create(input: CreateExampleInput): Promise<ExampleItem> {
    return prisma.example.create({ data: input });
  }
}

export const exampleRepository = new ExampleRepository();
