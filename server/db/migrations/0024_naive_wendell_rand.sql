PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_team` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`match_id` integer NOT NULL,
	`team` integer NOT NULL,
	`wins` integer DEFAULT 0 NOT NULL,
	`updated_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`match_id`) REFERENCES `match`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_team`("id", "match_id", "team", "wins", "updated_at", "created_at") SELECT "id", "match_id", "team", "wins", "updated_at", "created_at" FROM `team`;--> statement-breakpoint
DROP TABLE `team`;--> statement-breakpoint
ALTER TABLE `__new_team` RENAME TO `team`;--> statement-breakpoint
PRAGMA foreign_keys=ON;