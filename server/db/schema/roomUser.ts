import { relations } from "drizzle-orm";
import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { createdAt } from "./partials/createdAt";
import { roomTable } from "./room";
import { userTable } from "./user";

export const roomUserTable = sqliteTable("room_user", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  roomId: integer("room_id")
    .references(() => roomTable.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => userTable.id)
    .notNull(),
  team: integer("team").notNull(),
  createdAt: createdAt,
});

export const roomUserRelations = relations(roomUserTable, ({ one }) => ({
  room: one(roomTable, {
    fields: [roomUserTable.roomId],
    references: [roomTable.id],
  }),
  user: one(userTable, {
    fields: [roomUserTable.userId],
    references: [userTable.id],
  }),
}));
