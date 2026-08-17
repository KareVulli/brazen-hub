PRAGMA defer_foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_weekly` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_id` integer NOT NULL,
	`week` integer NOT NULL,
	`world_record_score_id` integer,
	`ends_at` integer NOT NULL,
	`raw` text NOT NULL,
	`created_at` integer NOT NULL,
	`rule_id` integer,
	`character_id` integer,
	`sub_weapon_id` integer,
	FOREIGN KEY (`world_record_score_id`) REFERENCES `score`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_weekly`("id", "event_id", "week", "world_record_score_id", "ends_at", "raw", "created_at", "rule_id", "character_id", "sub_weapon_id") SELECT "id", "event_id", "week", "world_record_score_id", "ends_at", "raw", "created_at", "rule_id", "character_id", "sub_weapon_id" FROM `weekly`;--> statement-breakpoint
DROP TABLE `weekly`;--> statement-breakpoint
ALTER TABLE `__new_weekly` RENAME TO `weekly`;--> statement-breakpoint
PRAGMA defer_foreign_keys=OFF;--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `weekly` (`created_at`);