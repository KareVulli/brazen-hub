import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createdAt } from "./partials/createdAt";
import { updatedAt } from "./partials/updatedAt";
import { ROLE_USER } from "../roles";

export const accountTable = sqliteTable("account", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  discordId: text("discord_id").unique().notNull(),
  discordDisplayname: text("discord_display_name").notNull(),
  discordName: text("discord_name").notNull(),
  brazenUserKey: text("brazen_user_key"),
  role: integer("role").notNull().default(ROLE_USER),
  updatedAt: updatedAt,
  createdAt: createdAt,
});
