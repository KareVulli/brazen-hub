PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_room_user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`room_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`team` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`room_id`) REFERENCES `room`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_room_user`("id", "room_id", "user_id", "team", "created_at") SELECT "id", "room_id", "user_id", "team", "created_at" FROM `room_user`;--> statement-breakpoint
DROP TABLE `room_user`;--> statement-breakpoint
ALTER TABLE `__new_room_user` RENAME TO `room_user`;--> statement-breakpoint
PRAGMA foreign_keys=ON;