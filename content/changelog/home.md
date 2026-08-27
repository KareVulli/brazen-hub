### 2026-08-27
- Fix a regression where `StatsBot` was not able to return back to room.
- [Fix revives not attributed to teammates.]{.text-primary-500}

### 2026-08-26
- Log an error event when `StatsBot` loses connection during a match.
- Fix some error cases not cleaning up correctly.
- Add `StatsBot` side network packet retransmission. Fixes some cases where `StatsBot` fails to join a room/match.

### 2026-08-25
- Fix issue where starting the match quickly after `StatsBot` joins causes the bot to get kicked on next return to lobby.
- Try to rejoin the room three times after match before giving up.
- Fix a case where `StatsBot` would fail to join match.
- Improve stability under poor network conditions.

### 2026-08-24

- [Detect and log player disconnections mid-match.]{.text-primary-500}
- Add `Copy match link` button to `Match details` for easier sharing in VR/mobile.
- Make `Match log` more compact and mobile friendly.
- Add `Changelog` to home.
- Add `Watcher Form` to home page for easier access and renamed watcher to `StatsBot`.
