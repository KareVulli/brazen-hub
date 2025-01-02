import { sqliteTable, integer } from "drizzle-orm/sqlite-core";
import { scoreTable } from "./score";
import { weeklyTable } from "./weekly";
import { relations } from "drizzle-orm";

export const weeklyScoreTable = sqliteTable("weekly_score", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  weeklyId: integer("weekly_id")
    .references(() => weeklyTable.id)
    .notNull(),
  scoreId: integer("score_id")
    .references(() => scoreTable.id)
    .notNull(),
});

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
