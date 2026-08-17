import { relations } from "drizzle-orm";
import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { createdAt } from "./partials/createdAt";
import { updatedAt } from "./partials/updatedAt";
import { roomSessionTable } from "./roomSession";
import { roomUserTable } from "./roomUser";
import { stageTable } from "./stage";

export const roomTable = sqliteTable("room", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  stageId: integer("stage_id").notNull(),
  gameRuleId: integer("game_rule_id").notNull(),
  public: integer({ mode: "boolean" }).notNull(),
  updatedAt: updatedAt,
  createdAt: createdAt,
});

export const roomRelations = relations(roomTable, ({ one, many }) => ({
  stage: one(stageTable, {
    fields: [roomTable.stageId],
    references: [stageTable.id],
  }),
  roomSessions: many(roomSessionTable),
  roomUsers: many(roomUserTable),
}));
