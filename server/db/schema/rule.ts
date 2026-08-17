import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const ruleTable = sqliteTable("rule", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  colorCode: text("color_code").notNull(),
  ruleId: integer("rule_id").notNull(),
  subRuleId: integer("sub_rule_id").notNull(),
  stageId: integer("stage_id").notNull(),
  stageName: text("stage_name").notNull(),
  stageThumbnail: text("stage_thumbnail").notNull(),
  subRuleType: text("sub_rule_type").notNull(),
});
