CREATE TABLE `game_rule` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`game_rule_id` integer NOT NULL,
	`rule_details_id` integer NOT NULL,
	`game_version` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`game_description` text NOT NULL,
	`team_count` integer NOT NULL,
	`min_team_count` integer NOT NULL,
	`players_per_team` integer NOT NULL,
	`kill_ultimage_bonus` integer NOT NULL,
	`teammate_death_ultimate_bonus` integer NOT NULL,
	`ultimage_rate` real NOT NULL,
	`game_rule_type` text NOT NULL,
	`collapse_time1` integer NOT NULL,
	`collapse_time2` integer NOT NULL,
	`collapse_time3` integer NOT NULL,
	`collapse_time4` integer NOT NULL,
	`collapse_time5` integer NOT NULL,
	`collapse_time_all` integer NOT NULL,
	`collapse_steps` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `stage` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`thumbnail_name` text NOT NULL
);
