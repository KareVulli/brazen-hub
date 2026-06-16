import { relations } from "drizzle-orm";
import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { matchTable } from "./match";
import { createdAt } from "./partials/createdAt";
import { updatedAt } from "./partials/updatedAt";
import { userTable } from "./user";

export const teamTable = sqliteTable("team", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  matchId: integer("match_id")
    .references(() => matchTable.id)
    .notNull(),
  userId: integer("user_id")
    .references(() => userTable.id)
    .notNull(),
  team: integer("team").notNull(),
  wins: integer("wins").notNull().default(0),
  updatedAt: updatedAt,
  createdAt: createdAt,
});

export const teamRelations = relations(teamTable, ({ one }) => ({
  match: one(matchTable, {
    fields: [teamTable.matchId],
    references: [matchTable.id],
  }),
  user: one(userTable, {
    fields: [teamTable.userId],
    references: [userTable.id],
  }),
}));
