PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_character` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
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
INSERT INTO `__new_character`("id", "character_id", "game_version", "created_at", "name", "display_name", "hp", "large_icon_name", "boost_recovery", "boost_max", "skill_name", "skill_description", "skill_range", "skill_recast_time", "ultimate_name", "ultimate_description", "ultimate_range", "ultimate_points", "ultimate_points_damage_multiplier", "ultimate_points_attack_multiplier") SELECT "id", "character_id", "game_version", "created_at", "name", "display_name", "hp", "large_icon_name", "boost_recovery", "boost_max", "skill_name", "skill_description", "skill_range", "skill_recast_time", "ultimate_name", "ultimate_description", "ultimate_range", "ultimate_points", "ultimate_points_damage_multiplier", "ultimate_points_attack_multiplier" FROM `character`;--> statement-breakpoint
DROP TABLE `character`;--> statement-breakpoint
ALTER TABLE `__new_character` RENAME TO `character`;--> statement-breakpoint
PRAGMA foreign_keys=ON;