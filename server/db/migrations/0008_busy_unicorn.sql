PRAGMA defer_foreign_keys = ON;
PRAGMA foreign_keys = OFF;
--> statement-breakpoint
CREATE TABLE `__new_user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`user_key` text NOT NULL,
	`icon_id` integer NOT NULL,
	`icon_frame_id` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_user`(
		"id",
		"name",
		"user_key",
		"icon_id",
		"icon_frame_id",
		"updated_at",
		"created_at"
	)
SELECT "id",
	"name",
	"user_key",
	"icon_id",
	"icon_frame_id",
	"updated_at",
	"created_at"
FROM `user`;
--> statement-breakpoint
DROP TABLE `user`;
--> statement-breakpoint
ALTER TABLE `__new_user`
	RENAME TO `user`;
--> statement-breakpoint
PRAGMA foreign_keys = ON;
--> statement-breakpoint
CREATE UNIQUE INDEX `user_user_key_unique` ON `user` (`user_key`);
PRAGMA defer_foreign_keys = OFF;