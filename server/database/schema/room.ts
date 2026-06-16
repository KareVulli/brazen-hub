import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { hostTable } from "./host";
import { createdAt } from "./partials/createdAt";
import { roomUserTable } from "./roomUser";
import { updatedAt } from "./partials/updatedAt";
import { stageTable } from "./stage";
import { matchTable } from "./match";

export const roomTable = sqliteTable("room", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  hostId: integer("host_id").notNull(),
  matchId: text("match_id").notNull(),
  stageId: integer("stage_id").notNull(),
  gameRuleId: integer("game_rule_id").notNull(),
  public: integer({ mode: "boolean" }).notNull(),
  invitationCode: text("invitation_code").notNull(),
  marsRoomId: text("mars_room_id").notNull(),
  updatedAt: updatedAt,
  createdAt: createdAt,
});

export const roomRelations = relations(roomTable, ({ one, many }) => ({
  host: one(hostTable, {
    fields: [roomTable.hostId],
    references: [hostTable.id],
  }),
  stage: one(stageTable, {
    fields: [roomTable.stageId],
    references: [stageTable.id],
  }),
  roomUsers: many(roomUserTable),
  matches: many(matchTable),
}));
