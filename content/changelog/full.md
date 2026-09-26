# Brazen Hub changelog

### 2026-09-26

- Fix spacing issues in mobile browsers where short labels are used.

### 2026-09-23

- [Collect and show **skill usage** count (behind **Show more stats** toggle).]{.text-primary-500}
- [Collect and show **ultimate usage** count (behind **Show more stats** toggle).]{.text-primary-500}
- Show instructions to follow **StatsBot** also when not logged in.

### 2026-09-22

- [Show user's most played **characters**, **sub-weapons**, **stages** and **rulesets** in user page.]{.text-primary-500}
- Show relative time of the match in **Custom Matches** list and details page.
- Remove match duration from **Custom Matches** list page.

### 2026-09-14

- [**StatsBot** can now be invited directly from in game.]{.text-primary-500}
- Add page specific titles to all pages.
- Fix consistency issues with navigation menu item name formatting.

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

### 2026-08-25

- Fix issue where starting the match quickly after **StatsBot** joins causes the bot to get kicked on next return to lobby.
- Try to rejoin the room three times after match before giving up.
- Fix a case where **StatsBot** would fail to join match.
- Improve stability under poor network conditions.

### 2026-08-24

- [Detect and log player disconnections mid-match.]{.text-primary-500}
- Add **Copy match link** button to **Match details** for easier sharing in VR/mobile.
- Make **Match log** more compact and mobile friendly.
- Add **Changelog** to home.
- Add **Watcher Form** to home page for easier access and renamed watcher to **StatsBot**.
