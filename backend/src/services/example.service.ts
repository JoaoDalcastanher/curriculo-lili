// EXAMPLE SERVICE — delete this file when implementing real features.
//
// Rules:
// - All business logic lives here (ADR-0003).
// - Never import Prisma directly — always go through a repository.
// - The repository is injected via the constructor for testability (ADR-0005).

import { TRPCError } from "@trpc/server";
import type { IExampleRepository } from "../repositories/interfaces";
import type { ExampleItem, CreateExampleInput, PaginatedResult } from "../model/example";
import { exampleRepository } from "../repositories/example.repository";

export class ExampleService {
  constructor(private readonly repository: IExampleRepository = exampleRepository) {}

  async list(page = 1, pageSize = 20): Promise<PaginatedResult<ExampleItem>> {
    const skip = (page - 1) * pageSize;
    return this.repository.list(pageSize, skip);
  }

  async getById(id: string): Promise<ExampleItem> {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Item não encontrado" });
    }
    return item;
  }

  async create(input: CreateExampleInput): Promise<ExampleItem> {
    return this.repository.create(input);
  }
}

export const exampleService = new ExampleService();
