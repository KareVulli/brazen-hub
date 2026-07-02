CREATE TABLE `room_session` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`room_id` integer NOT NULL,
	`host_id` integer NOT NULL,
	`match_id` text NOT NULL,
	`invitation_code` text NOT NULL,
	`mars_room_id` text NOT NULL,
	`active` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`room_id`) REFERENCES `room`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`host_id`) REFERENCES `host`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `team_match_id_team_unique` ON `team` (`match_id`,`team`);--> statement-breakpoint
ALTER TABLE `room` DROP COLUMN `host_id`;--> statement-breakpoint
ALTER TABLE `room` DROP COLUMN `match_id`;--> statement-breakpoint
ALTER TABLE `room` DROP COLUMN `invitation_code`;--> statement-breakpoint
ALTER TABLE `room` DROP COLUMN `mars_room_id`;