// EXAMPLE MODELS — delete this file when implementing real features.
//
// All types that cross a layer boundary (repository → service → router) are defined
// here as named types. Anonymous inline types are never used at boundaries (ADR-0005).

export interface ExampleItem {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
}

export interface CreateExampleInput {
  name: string;
  description?: string;
}

// Generic pagination wrapper — move to a shared model file when used by real features.
export interface PaginatedResult<T> {
  items: T[];
  total: number;
}
