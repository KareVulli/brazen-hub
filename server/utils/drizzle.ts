import * as schema from "../database/schema";
import { drizzle } from "drizzle-orm/d1";
export { sql, eq, and, or, desc, lt, gt } from "drizzle-orm";

export const tables = schema;

export function useDrizzle() {
  return drizzle(hubDatabase(), { schema });
}

export type User = typeof schema.user.$inferSelect;
export type Score = typeof schema.score.$inferSelect;
export type Weekly = typeof schema.weekly.$inferSelect;
export type WeeklyScore = typeof schema.weeklyScore.$inferSelect;
