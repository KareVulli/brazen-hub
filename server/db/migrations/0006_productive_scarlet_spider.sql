CREATE TABLE `item` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`item_id` integer NOT NULL,
	`game_version` text NOT NULL,
	`created_at` integer NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`icon` text NOT NULL,
	`hud_icon` text NOT NULL,
	`count` integer NOT NULL
);
