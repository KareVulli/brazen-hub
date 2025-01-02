import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const characterTable = sqliteTable("character", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  characterId: integer("character_id").notNull(),
  gameVersion: text("game_version").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$default(() => new Date()),
  name: text("name").notNull(),
  displayName: text("display_name").notNull(),
  hp: integer("hp").notNull(),
  largeIconName: text("large_icon_name").notNull(),
  boostRecovery: real("boost_recovery").notNull(),
  boostMax: real("boost_max").notNull(),
  skillName: text("skill_name").notNull(),
  skillDescription: text("skill_description").notNull(),
  skillRange: real("skill_range").notNull(),
  skillRecastTime: real("skill_recast_time").notNull(),
  ultimateName: text("ultimate_name").notNull(),
  ultimateDescription: text("ultimate_description").notNull(),
  ultimateRange: real("ultimate_range").notNull(),
  ultimatePoints: integer("ultimate_points").notNull(),
  ultimatePointsDamageMultiplier: real(
    "ultimate_points_damage_multiplier"
  ).notNull(),
  ultimatePointsAttackMultiplier: real(
    "ultimate_points_attack_multiplier"
  ).notNull(),
});
