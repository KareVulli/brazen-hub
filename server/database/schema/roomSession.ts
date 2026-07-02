import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { hostTable } from "./host";
import { createdAt } from "./partials/createdAt";
import { updatedAt } from "./partials/updatedAt";
import { roomTable } from "./room";

export const roomSessionTable = sqliteTable("room_session", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  roomId: integer("room_id")
    .references(() => roomTable.id)
    .notNull(),
  hostId: integer("host_id")
    .references(() => hostTable.id)
    .notNull(),
  matchId: text("match_id").notNull(),
  invitationCode: text("invitation_code").notNull(),
  marsRoomId: text("mars_room_id").notNull(),
  active: integer({ mode: "boolean" }).notNull(),
  updatedAt: updatedAt,
  createdAt: createdAt,
});

export const roomSessionRelations = relations(roomSessionTable, ({ one }) => ({
  room: one(roomTable, {
    fields: [roomSessionTable.roomId],
    references: [roomTable.id],
  }),
  host: one(hostTable, {
    fields: [roomSessionTable.hostId],
    references: [hostTable.id],
  }),
}));
