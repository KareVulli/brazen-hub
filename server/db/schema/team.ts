import { relations } from "drizzle-orm";
import { integer, sqliteTable, unique } from "drizzle-orm/sqlite-core";
import { matchTable } from "./match";
import { createdAt } from "./partials/createdAt";
import { updatedAt } from "./partials/updatedAt";
import { teamUserTable } from "./teamUser";

export const teamTable = sqliteTable(
  "team",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    matchId: integer("match_id")
      .references(() => matchTable.id)
      .notNull(),
    team: integer("team").notNull(),
    wins: integer("wins").notNull().default(0),
    placement: integer("placement").notNull().default(0),
    updatedAt: updatedAt,
    createdAt: createdAt,
  },
  (table) => [unique().on(table.matchId, table.team)],
);

export const teamRelations = relations(teamTable, ({ one, many }) => ({
  match: one(matchTable, {
    fields: [teamTable.matchId],
    references: [matchTable.id],
  }),
  teamUsers: many(teamUserTable),
}));
