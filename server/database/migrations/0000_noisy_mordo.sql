CREATE TABLE `score` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`place` integer NOT NULL,
	`user_id` integer NOT NULL,
	`time` integer NOT NULL,
	`score` integer NOT NULL,
	`attempts` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`user_key` text NOT NULL,
	`icon_id` integer NOT NULL,
	`icon_frame_id` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_user_key_unique` ON `user` (`user_key`);--> statement-breakpoint
CREATE TABLE `weekly` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_id` integer NOT NULL,
	`world_record_score_id` integer NOT NULL,
	`ends_at` integer NOT NULL,
	`raw` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`world_record_score_id`) REFERENCES `score`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `weekly_score` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`weekly_id` integer NOT NULL,
	`score_id` integer NOT NULL,
	FOREIGN KEY (`weekly_id`) REFERENCES `weekly`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`score_id`) REFERENCES `score`(`id`) ON UPDATE no action ON DELETE no action
);
