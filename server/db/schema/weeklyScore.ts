import { sqliteTable, integer, index } from "drizzle-orm/sqlite-core";
import { scoreTable } from "./score";
import { weeklyTable } from "./weekly";
import { relations } from "drizzle-orm";

export const weeklyScoreTable = sqliteTable(
  "weekly_score",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    weeklyId: integer("weekly_id")
      .references(() => weeklyTable.id)
      .notNull(),
    scoreId: integer("score_id")
      .references(() => scoreTable.id)
      .notNull(),
  },
  (table) => [
    index("weekly_score_weekly_id_idx").on(table.weeklyId),
    index("weekly_score_score_id_idx").on(table.scoreId),
  ],
);

export const weeklyScoreRelations = relations(weeklyScoreTable, ({ one }) => ({
  weekly: one(weeklyTable, {
    fields: [weeklyScoreTable.weeklyId],
    references: [weeklyTable.id],
  }),
  score: one(scoreTable, {
    fields: [weeklyScoreTable.scoreId],
    references: [scoreTable.id],
  }),
}));
