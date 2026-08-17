CREATE TABLE `rule` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`color_code` text NOT NULL,
	`rule_id` integer NOT NULL,
	`sub_rule_id` integer NOT NULL,
	`stage_id` integer NOT NULL,
	`stage_name` text NOT NULL,
	`sub_rule_type` text NOT NULL
);
ALTER TABLE `weekly`
ADD COLUMN `rule_id` integer;