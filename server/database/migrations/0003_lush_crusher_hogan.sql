PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_rule` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`color_code` text NOT NULL,
	`rule_id` integer NOT NULL,
	`sub_rule_id` integer NOT NULL,
	`stage_id` integer NOT NULL,
	`stage_name` text NOT NULL,
	`stage_thumbnail` text NOT NULL,
	`sub_rule_type` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_rule`("id", "name", "color_code", "rule_id", "sub_rule_id", "stage_id", "stage_name", "stage_thumbnail", "sub_rule_type") SELECT "id", "name", "color_code", "rule_id", "sub_rule_id", "stage_id", "stage_name", "stage_thumbnail", "sub_rule_type" FROM `rule`;--> statement-breakpoint
DROP TABLE `rule`;--> statement-breakpoint
ALTER TABLE `__new_rule` RENAME TO `rule`;--> statement-breakpoint
PRAGMA foreign_keys=ON;