import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAt } from "./partials/createdAt";
import { roomTable } from "./room";

export const roomUserTable = sqliteTable("room_user", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  roomId: integer("room_id").notNull(),
  userKey: text("user_key").notNull(),
  createdAt: createdAt,
});

export const roomUserRelations = relations(roomUserTable, ({ one }) => ({
  room: one(roomTable, {
    fields: [roomUserTable.roomId],
    references: [roomTable.id],
  }),
}));
