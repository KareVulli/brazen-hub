CREATE TABLE `host` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`user_key` text NOT NULL,
	`token` text NOT NULL,
	`updated_at` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `room` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`host_id` integer NOT NULL,
	`match_id` text NOT NULL,
	`stage_id` integer NOT NULL,
	`game_rule_id` integer NOT NULL,
	`public` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`created_at` integer NOT NULL
);
