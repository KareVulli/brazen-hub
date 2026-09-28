import { integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const settingsTable = sqliteTable("settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  maintenance: integer("maintenance", { mode: "boolean" })
    .notNull()
    .default(false),
  matchmakingMaintenance: integer("matchmaking_maintenance", {
    mode: "boolean",
  })
    .notNull()
    .default(false),
});
