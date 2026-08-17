import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAt } from "./partials/createdAt";
import { updatedAt } from "./partials/updatedAt";

export const hostTable = sqliteTable("host", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  userKey: text("user_key").notNull(),
  token: text("token").notNull(),
  updatedAt: updatedAt,
  createdAt: createdAt,
});
