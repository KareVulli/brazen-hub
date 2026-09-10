### 2026-09-10

- [Show **Average Damage per Round (ADR)** on user page based on full completed RTM recorded matches.]{.text-primary-500}

### 2026-09-03

- [Show **revives** count for players in match stats table (behind **Show more stats** toggle.)]{.text-primary-500}
- Show only five latest days with changes in home page **changelog** panel.
- Add **full changelog** page.

### 2026-09-01

- Fix all players being marked disconnected after a mid-match disconnect in some cases.
- Fix potential **room** error when starting a match while trying to add a second **StatsBot** to the room.
- Fix **Add StatsBot!** button not being disabled while in loading state.

### 2026-08-27

- [Show **Kill/Death Ratio (KDR)** on user page based on recorded matches.]{.text-primary-500}
- Fix a regression where **StatsBot** was not able to return back to room.
- [Fix revives not attributed to teammates.]{.text-primary-500}

### 2026-08-26

- Log an error event when **StatsBot** loses connection during a match.
- Fix some error cases not cleaning up correctly.
- Add **StatsBot** side network packet retransmission. Fixes some cases where **StatsBot** fails to join a room/match.
