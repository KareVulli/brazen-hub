CREATE TABLE `settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`maintenance` integer DEFAULT false NOT NULL,
	`matchmaking_maintenance` integer DEFAULT false NOT NULL
);
