import { sqliteTable, integer } from "drizzle-orm/sqlite-core";
import { userTable } from "./user";
import { relations } from "drizzle-orm";

export const scoreTable = sqliteTable("score", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  place: integer("place").notNull(),
  userId: integer("user_id")
    .references(() => userTable.id)
    .notNull(),
  time: integer("time").notNull(),
  score: integer("score").notNull(),
  attempts: integer("attempts").notNull(),
});

export const scoreRelations = relations(scoreTable, ({ one }) => ({
  user: one(userTable, {
    fields: [scoreTable.userId],
    references: [userTable.id],
  }),
}));
