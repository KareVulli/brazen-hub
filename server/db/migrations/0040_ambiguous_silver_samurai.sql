ALTER TABLE `match` ADD `errored` integer DEFAULT false NOT NULL;
UPDATE match SET errored = 1 WHERE errored = 0 AND id IN (SELECT match_id FROM match_event WHERE name = 'error');