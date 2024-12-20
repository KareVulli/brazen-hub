import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { rule } from "./rule";

export { rule } from "./rule";

export const user = sqliteTable("user", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  userKey: text("user_key").unique().notNull(),
  iconId: integer("icon_id").notNull(),
  iconFrameId: integer("icon_frame_id").notNull(),
});

export const score = sqliteTable("score", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  place: integer("place").notNull(),
  userId: integer("user_id")
    .references(() => user.id)
    .notNull(),
  time: integer("time").notNull(),
  score: integer("score").notNull(),
  attempts: integer("attempts").notNull(),
});

export const scoreRelations = relations(score, ({ one }) => ({
  user: one(user, {
    fields: [score.userId],
    references: [user.id],
  }),
}));

export const weekly = sqliteTable("weekly", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  eventId: integer("event_id").notNull(),
  worldRecordId: integer("world_record_score_id").references(() => score.id),
  endsAt: integer("ends_at").notNull(),
  raw: text("raw", { mode: "json" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$default(() => new Date()),
  ruleId: integer("rule_id"),
});

export const weeklyRelations = relations(weekly, ({ one, many }) => ({
  worldRecord: one(score, {
    fields: [weekly.worldRecordId],
    references: [score.id],
  }),
  weeklyScores: many(weeklyScore),
  rule: one(rule, {
    fields: [weekly.ruleId],
    references: [rule.id],
  }),
}));

export const weeklyScore = sqliteTable("weekly_score", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  weeklyId: integer("weekly_id")
    .references(() => weekly.id)
    .notNull(),
  scoreId: integer("score_id")
    .references(() => score.id)
    .notNull(),
});

export const weeklyScoreRelations = relations(weeklyScore, ({ one }) => ({
  weekly: one(weekly, {
    fields: [weeklyScore.weeklyId],
    references: [weekly.id],
  }),
  score: one(score, {
    fields: [weeklyScore.scoreId],
    references: [score.id],
  }),
}));
