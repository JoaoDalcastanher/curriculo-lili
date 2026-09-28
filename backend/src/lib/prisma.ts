import { PrismaClient } from "@prisma/client";

// Singleton Prisma client.
// Only repositories may import this — never services, routers, or utilities (ADR-0003).
export const prisma = new PrismaClient();
