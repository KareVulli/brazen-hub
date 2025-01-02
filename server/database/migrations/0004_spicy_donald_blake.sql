CREATE TABLE `character` (
	`id` integer PRIMARY KEY NOT NULL,
	`character_id` integer NOT NULL,
	`game_version` text NOT NULL,
	`created_at` integer NOT NULL,
	`name` text NOT NULL,
	`display_name` text NOT NULL,
	`hp` integer NOT NULL,
	`large_icon_name` text NOT NULL,
	`boost_recovery` real NOT NULL,
	`boost_max` real NOT NULL,
	`skill_name` text NOT NULL,
	`skill_description` text NOT NULL,
	`skill_range` real NOT NULL,
	`skill_recast_time` real NOT NULL,
	`ultimate_name` text NOT NULL,
	`ultimate_description` text NOT NULL,
	`ultimate_range` real NOT NULL,
	`ultimate_points` integer NOT NULL,
	`ultimate_points_damage_multiplier` real NOT NULL,
	`ultimate_points_attack_multiplier` real NOT NULL
);
--> statement-breakpoint
ALTER TABLE `weekly` ADD `character_id` integer;--> statement-breakpoint
ALTER TABLE `weekly` ADD `sub_weapon_id` integer;