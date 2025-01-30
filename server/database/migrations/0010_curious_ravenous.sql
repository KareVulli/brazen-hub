ALTER TABLE `score`
ADD `rule_id` integer;
--> statement-breakpoint
ALTER TABLE `score`
ADD `character_id` integer;
--> statement-breakpoint
ALTER TABLE `score`
ADD `sub_weapon_id` integer;
--> statement-breakpoint
ALTER TABLE `score`
ADD `set_at` integer;
--> statement-breakpoint
ALTER TABLE `score`
ADD `created_at` integer DEFAULT 1738268077 NOT NULL;