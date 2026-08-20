import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { matchTable } from "./match";
import { createdAt } from "./partials/createdAt";

const MATCH_EVENT_NAMES = [
  "stun",
  "kill",
  "revive",
  "round-start",
  "round-end",
] as const;

export const matchEventTable = sqliteTable("match_event", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  matchId: integer("match_id")
    .references(() => matchTable.id)
    .notNull(),
  name: text("name", { enum: MATCH_EVENT_NAMES }).notNull(),
  data: text("data", { mode: "json" }).notNull(),
  eventAt: integer("eventAt", { mode: "timestamp" }).notNull(),
  createdAt: createdAt,
});

export const matchEventRelations = relations(matchEventTable, ({ one }) => ({
  match: one(matchTable, {
    fields: [matchEventTable.matchId],
    references: [matchTable.id],
  }),
}));
