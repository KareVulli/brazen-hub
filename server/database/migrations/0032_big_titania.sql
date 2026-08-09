PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_match` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`room_session_id` integer NOT NULL,
	`stage_id` integer NOT NULL,
	`game_rule_id` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`ended_at` integer,
	FOREIGN KEY (`room_session_id`) REFERENCES `room_session`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`game_rule_id`) REFERENCES `game_rule`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DELETE FROM `team_user`;
DELETE FROM `team`;
DROP TABLE `match`;--> statement-breakpoint
ALTER TABLE `__new_match` RENAME TO `match`;--> statement-breakpoint
PRAGMA foreign_keys=ON;