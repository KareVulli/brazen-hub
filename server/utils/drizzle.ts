import { drizzle } from "drizzle-orm/d1";
import * as schema from "../database/schema";
export { sql, eq, and, or, desc, lt, gt } from "drizzle-orm";

export function useDrizzle() {
  return drizzle(hubDatabase(), { schema: schema });
}

export type User = typeof schema.userTable.$inferSelect;
export type Score = typeof schema.scoreTable.$inferSelect;
export type Weekly = typeof schema.weeklyTable.$inferSelect;
export type WeeklyScore = typeof schema.weeklyScoreTable.$inferSelect;
export type Rule = typeof schema.ruleTable.$inferSelect;
