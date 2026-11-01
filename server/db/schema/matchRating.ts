import { relations } from "drizzle-orm";
import { index, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { matchTable } from "./match";
import { createdAt } from "./partials/createdAt";
import { userTable } from "./user";

export const matchRatingTable = sqliteTable(
  "match_rating",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    matchId: integer("match_id")
      .references(() => matchTable.id)
      .notNull(),
    userId: integer("user_id")
      .references(() => userTable.id)
      .notNull(),
    oldRating: integer("old_rating").notNull(),
    newRating: integer("new_rating").notNull(),
    createdAt: createdAt,
  },
  (table) => [
    index("match_rating_match_id_idx").on(table.matchId),
    index("match_rating_user_id_idx").on(table.userId),
  ],
);

export const matchRelations = relations(matchRatingTable, ({ one }) => ({
  match: one(matchTable, {
    fields: [matchRatingTable.matchId],
    references: [matchTable.id],
  }),
  user: one(userTable, {
    fields: [matchRatingTable.userId],
    references: [userTable.id],
  }),
}));
