import {
  integer,
  real,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";
import { createdAt } from "./partials/createdAt";

export const additionalEffectTable = sqliteTable(
  "additional_effect",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    additionalEffectId: integer("additional_effect_id").notNull(),
    gameVersion: text("game_version").notNull(),
    createdAt: createdAt,
    categoryType: text("category_type").notNull(),
    additionalEffectType: text("additional_effect_type").notNull(),
    enchantGroup: text("enchant_group").notNull(),
    priority: integer("priority").notNull(),
    validStun: integer("valid_stun", { mode: "boolean" }).notNull(),
    validFinisher: integer("valid_finisher", { mode: "boolean" }).notNull(),
    cancelCondition: text("cancel_condition").notNull(),
    assetName: text("asset_name").notNull(),
    time: real("time").notNull(),
    val1: integer("val1").notNull(),
    val2: integer("val2").notNull(),
    val3: integer("val3").notNull(),
    val4: integer("val4").notNull(),
  },
  (table) => [unique().on(table.additionalEffectId, table.gameVersion)],
);
