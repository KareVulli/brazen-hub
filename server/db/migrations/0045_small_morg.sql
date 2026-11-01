CREATE TABLE `match_rating` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`match_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`old_rating` integer NOT NULL,
	`new_rating` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`match_id`) REFERENCES `match`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `match_rating_match_id_idx` ON `match_rating` (`match_id`);--> statement-breakpoint
CREATE INDEX `match_rating_user_id_idx` ON `match_rating` (`user_id`);--> statement-breakpoint
ALTER TABLE `match` ADD `ranked` integer DEFAULT false NOT NULL;