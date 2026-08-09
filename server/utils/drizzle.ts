import { drizzle } from "drizzle-orm/d1";
import * as schema from "../database/schema";
export { sql, eq, and, or, desc, asc, lt, gt } from "drizzle-orm";

export function useDrizzle() {
  return drizzle(hubDatabase(), { schema: schema });
}

export type DBUser = typeof schema.userTable.$inferSelect;
export type DBScore = typeof schema.scoreTable.$inferSelect;
export type DBWeekly = typeof schema.weeklyTable.$inferSelect;
export type DBWeeklyScore = typeof schema.weeklyScoreTable.$inferSelect;
export type DBRule = typeof schema.ruleTable.$inferSelect;
export type DBCharacter = typeof schema.characterTable.$inferSelect;
export type DBItem = typeof schema.itemTable.$inferSelect;
export type DBGameRule = typeof schema.gameRuleTable.$inferSelect;
export type DBStage = typeof schema.stageTable.$inferSelect;
export type DBAccount = typeof schema.accountTable.$inferSelect;
export type DBHost = typeof schema.hostTable.$inferSelect;
export type DBRoom = typeof schema.roomTable.$inferSelect;
export type DBRoomSession = typeof schema.roomSessionTable.$inferSelect;
export type DBRoomUser = typeof schema.roomUserTable.$inferSelect;
export type DBMatch = typeof schema.matchTable.$inferSelect;
export type DBTeam = typeof schema.teamTable.$inferSelect;
export type DBTeamUser = typeof schema.teamUserTable.$inferSelect;

export type DBScoreInsert = typeof schema.scoreTable.$inferInsert;
export type DBRoomInsert = typeof schema.roomTable.$inferInsert;
export type DBTeamUserInsert = typeof schema.teamUserTable.$inferInsert;
