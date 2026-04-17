CREATE TABLE `room_user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`room_id` integer NOT NULL,
	`user_key` text NOT NULL,
	`created_at` integer NOT NULL
);
