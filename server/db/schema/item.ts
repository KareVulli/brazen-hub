import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAt } from "./partials/createdAt";

export const itemTable = sqliteTable("item", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  itemId: integer("item_id").notNull(),
  gameVersion: text("game_version").notNull(),
  createdAt: createdAt,
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  hudIcon: text("hud_icon").notNull(),
  count: integer("count").notNull(),
});
