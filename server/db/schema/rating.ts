import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { createdAt } from "./partials/createdAt";
import { updatedAt } from "./partials/updatedAt";
import { userTable } from "./user";
import { relations } from "drizzle-orm";

export const ratingTable = sqliteTable("rating", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .references(() => userTable.id)
    .notNull()
    .unique(),
  rating: integer("rating").notNull(),
  matches: integer("matches").notNull().default(0),
  updatedAt: updatedAt,
  createdAt: createdAt,
});

export const ratingRelations = relations(ratingTable, ({ one }) => ({
  user: one(userTable, {
    fields: [ratingTable.userId],
    references: [userTable.id],
  }),
}));
