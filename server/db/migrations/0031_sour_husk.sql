PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_room_session` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`room_id` integer,
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
INSERT INTO `__new_room_session`("id", "room_id", "host_id", "match_id", "invitation_code", "mars_room_id", "active", "updated_at", "created_at") SELECT "id", "room_id", "host_id", "match_id", "invitation_code", "mars_room_id", "active", "updated_at", "created_at" FROM `room_session`;--> statement-breakpoint
DROP TABLE `room_session`;--> statement-breakpoint
ALTER TABLE `__new_room_session` RENAME TO `room_session`;--> statement-breakpoint
PRAGMA foreign_keys=ON;