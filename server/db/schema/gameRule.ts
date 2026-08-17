import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const gameRuleTable = sqliteTable("game_rule", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  gameRuleId: integer("game_rule_id").notNull(),
  ruleDetailsId: integer("rule_details_id").notNull(),
  gameVersion: text("game_version").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  gameDescription: text("game_description").notNull(),
  teamCount: integer("team_count").notNull(),
  minTeamCount: integer("min_team_count").notNull(),
  playersPerTeam: integer("players_per_team").notNull(),
  killUltimateBonus: integer("kill_ultimage_bonus").notNull(),
  teammateDeathUltimateBonus: integer(
    "teammate_death_ultimate_bonus"
  ).notNull(),
  ultimateRate: real("ultimage_rate").notNull(),
  gameRuleType: text("game_rule_type").notNull(),
  collapseTime1: integer("collapse_time1").notNull(),
  collapseTime2: integer("collapse_time2").notNull(),
  collapseTime3: integer("collapse_time3").notNull(),
  collapseTime4: integer("collapse_time4").notNull(),
  collapseTime5: integer("collapse_time5").notNull(),
  collapseTimeAll: integer("collapse_time_all").notNull(),
  collapseSteps: integer("collapse_steps").notNull(),
});
