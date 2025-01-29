import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const stageTable = sqliteTable("stage", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  thumbnailName: text("thumbnail_name").notNull(),
});
