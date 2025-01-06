import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const itemTable = sqliteTable("item", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  itemId: integer("item_id").notNull(),
  gameVersion: text("game_version").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$default(() => new Date()),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  hudIcon: text("hud_icon").notNull(),
  count: integer("count").notNull(),
});
