import type { SQL } from "drizzle-orm";
import type { SQLiteTable } from "drizzle-orm/sqlite-core";
import { getColumns } from "./getColumns";

export function buildConflictUpdateColumns<
  T extends SQLiteTable,
  Q extends keyof T["_"]["columns"],
>(table: T, columns: Q[]): Record<Q, SQL> {
  const cls = getColumns(table);

  return columns.reduce<Record<Q, SQL>>(
    (acc, column) => {
      const colName = cls[column]!.name;
      acc[column] = sql.raw(`excluded.${colName}`);

      return acc;
    },
    {} as Record<Q, SQL>,
  );
}
