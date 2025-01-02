import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { ruleTable } from "./rule";
import { scoreTable } from "./score";
import { weeklyScoreTable } from "./weeklyScore";

export const weeklyTable = sqliteTable("weekly", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  eventId: integer("event_id").notNull(),
  worldRecordId: integer("world_record_score_id").references(
    () => scoreTable.id
  ),
  endsAt: integer("ends_at").notNull(),
  raw: text("raw", { mode: "json" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$default(() => new Date()),
  ruleId: integer("rule_id"),
  characterId: integer("character_id"),
  subWeaponId: integer("sub_weapon_id"),
});

export const weeklyRelations = relations(weeklyTable, ({ one, many }) => ({
  worldRecord: one(scoreTable, {
    fields: [weeklyTable.worldRecordId],
    references: [scoreTable.id],
  }),
  weeklyScores: many(weeklyScoreTable),
  rule: one(ruleTable, {
    fields: [weeklyTable.ruleId],
    references: [ruleTable.id],
  }),
}));
