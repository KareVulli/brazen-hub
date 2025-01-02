import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable("user", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  userKey: text("user_key").unique().notNull(),
  iconId: integer("icon_id").notNull(),
  iconFrameId: integer("icon_frame_id").notNull(),
});
