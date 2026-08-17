import { relations } from "drizzle-orm";
import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { gameRuleTable } from "./gameRule";
import { createdAt } from "./partials/createdAt";
import { updatedAt } from "./partials/updatedAt";
import { roomSessionTable } from "./roomSession";
import { stageTable } from "./stage";
import { teamTable } from "./team";

export const matchTable = sqliteTable("match", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  roomSessionId: integer("room_session_id")
    .references(() => roomSessionTable.id)
    .notNull(),
  stageId: integer("stage_id").notNull(),
  gameRuleId: integer("game_rule_id")
    .references(() => gameRuleTable.id)
    .notNull(),
  updatedAt: updatedAt,
  createdAt: createdAt,
  endedAt: integer("ended_at", { mode: "timestamp" }),
});

export const matchRelations = relations(matchTable, ({ one, many }) => ({
  stage: one(stageTable, {
    fields: [matchTable.stageId],
    references: [stageTable.id],
  }),
  roomSession: one(roomSessionTable, {
    fields: [matchTable.roomSessionId],
    references: [roomSessionTable.id],
  }),
  gameRule: one(gameRuleTable, {
    fields: [matchTable.gameRuleId],
    references: [gameRuleTable.id],
  }),
  teams: many(teamTable),
}));
