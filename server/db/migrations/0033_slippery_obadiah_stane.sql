ALTER TABLE `weekly` ADD `week` integer;
WITH event_weeks AS (
    SELECT
        event_id,
        ROW_NUMBER() OVER (
        ORDER BY MAX(ends_at) ASC, event_id ASC
        ) + 1 AS week
    FROM weekly
    GROUP BY event_id
)
UPDATE weekly
SET week = (
    SELECT event_weeks.week
    FROM event_weeks
    WHERE event_weeks.event_id = weekly.event_id
);