CREATE TABLE `account` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`discord_id` text NOT NULL,
	`discord_display_name` text NOT NULL,
	`discord_name` text NOT NULL,
	`brazen_user_key` text,
	`role` integer DEFAULT 0 NOT NULL,
	`updated_at` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `account_discord_id_unique` ON `account` (`discord_id`);