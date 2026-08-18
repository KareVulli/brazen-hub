import type { SQLiteColumn, SQLiteSelect } from "drizzle-orm/sqlite-core";
import z from "zod";

const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 200;

export function getPaginationSchema(
  sortFields: SQLiteColumn[],
  defaultSortField: SQLiteColumn,
  defaultDirection: "asc" | "desc" = "asc",
) {
  const fieldMap = [defaultSortField, ...sortFields].reduce<
    Record<string, SQLiteColumn>
  >((acc, field) => ({ ...acc, [field.name]: field }), {});
  return z.object({
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce
      .number()
      .int()
      .min(1)
      .max(MAX_PAGE_SIZE)
      .default(DEFAULT_PAGE_SIZE),
    sort: z
      .enum(sortFields.map((field) => field.name))
      .default(defaultSortField.name)
      .transform((value) => fieldMap[value]!),
    sortDirection: z.enum(["asc", "desc"]).default(defaultDirection),
  });
}

export type PaginationOptions = z.infer<ReturnType<typeof getPaginationSchema>>;

export function paginatedSchema<TItem extends z.ZodType>(item: TItem) {
  return z.object({
    results: z.array(item),
    pagination: paginatedSchema,
  });
}

export type Pagination = {
  page: number;
  pageSize: number;
  count: number;
  pages: number;
};

export interface PaginatedResponse<T> {
  results: T[];
  pagination: Pagination;
}

export async function paginateResults<TQuery extends SQLiteSelect>(
  query: TQuery,
  { page, pageSize, sort, sortDirection }: PaginationOptions,
) {
  const offset = (page - 1) * pageSize;

  const count = await useDrizzle().$count(query);
  const results = await query
    .orderBy(sortDirection === "asc" ? asc(sort) : desc(sort))
    .limit(pageSize)
    .offset(offset);
  const pages = Math.ceil(count / pageSize);

  return {
    results: results,
    pagination: {
      page,
      pageSize,
      count,
      pages,
    } satisfies Pagination,
  };
}
