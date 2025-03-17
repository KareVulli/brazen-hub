ALTER TABLE `score`
	RENAME COLUMN place to place_old;
ALTER TABLE `score`
ADD place integer;
update `score`
set place = place_old;
ALTER TABLE `score` DROP COLUMN place_old;