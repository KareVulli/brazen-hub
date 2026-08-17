ALTER TABLE `score`
	RENAME COLUMN attempts to attempts_old;
ALTER TABLE `score`
ADD attempts integer;
UPDATE `score`
SET attempts = attempts_old;
ALTER TABLE `score` DROP COLUMN attempts_old;