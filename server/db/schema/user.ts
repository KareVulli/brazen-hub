import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAt } from "./partials/createdAt";
import { updatedAt } from "./partials/updatedAt";

export const userTable = sqliteTable("user", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  userKey: text("user_key").unique().notNull(),
  iconId: integer("icon_id").notNull(),
  iconFrameId: integer("icon_frame_id").notNull(),
  bot: integer({ mode: "boolean" }).notNull().default(false),
  updatedAt: updatedAt,
  createdAt: createdAt,
});
