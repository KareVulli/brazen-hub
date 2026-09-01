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
