ALTER TABLE `team_user` RENAME COLUMN "healed" TO "healing_received";--> statement-breakpoint
ALTER TABLE `team_user` ADD `healing_done` integer DEFAULT 0 NOT NULL;