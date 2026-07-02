import { relations } from "drizzle-orm";
import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { createdAt } from "./partials/createdAt";
import { updatedAt } from "./partials/updatedAt";
import { stageTable } from "./stage";
import { roomTable } from "./room";
import { teamTable } from "./team";

export const matchTable = sqliteTable("match", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  roomId: integer("room_id")
    .references(() => roomTable.id)
    .notNull(),
  stageId: integer("stage_id").notNull(),
  updatedAt: updatedAt,
  createdAt: createdAt,
});

export const matchRelations = relations(matchTable, ({ one, many }) => ({
  stage: one(stageTable, {
    fields: [matchTable.stageId],
    references: [stageTable.id],
  }),
  room: one(roomTable, {
    fields: [matchTable.roomId],
    references: [roomTable.id],
  }),
  teams: many(teamTable),
}));
