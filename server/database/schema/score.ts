import { relations } from "drizzle-orm";
import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { createdAt } from "./partials/createdAt";
import { ruleTable } from "./rule";
import { userTable } from "./user";
import { weeklyScoreTable } from "./weeklyScore";

export const scoreTable = sqliteTable("score", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  place: integer("place"),
  userId: integer("user_id")
    .references(() => userTable.id)
    .notNull(),
  time: integer("time").notNull(),
  score: integer("score").notNull(),
  attempts: integer("attempts").notNull(),
  ruleId: integer("rule_id"),
  characterId: integer("character_id"),
  subWeaponId: integer("sub_weapon_id"),
  setAt: integer("set_at"),
  createdAt: createdAt,
});

export const scoreRelations = relations(scoreTable, ({ one }) => ({
  user: one(userTable, {
    fields: [scoreTable.userId],
    references: [userTable.id],
  }),
  rule: one(ruleTable, {
    fields: [scoreTable.ruleId],
    references: [ruleTable.id],
  }),
  weeklyScore: one(weeklyScoreTable),
}));
