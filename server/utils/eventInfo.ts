import { asc } from "drizzle-orm";
import {
  scoreTable,
  userTable,
  weeklyScoreTable,
  weeklyTable,
} from "../database/schema";
import type { Character } from "./character";
import {
  getCharacterByCharacterId,
  getCharactersByGameVersion,
} from "./character";
import type {
  DBRule,
  DBScore,
  DBUser,
  DBWeekly,
  DBWeeklyScore,
} from "./drizzle";
import { getItemByItemId, getItemsByGameVersion } from "./item";
import type { RuleDto } from "./rule";
import type {
  BrazenApiEventInfo,
  EventInfoDto,
} from "./brazen-api/getEventInfo";

export interface LeaderboardEntry {
  place: number;
  user: BrazenUser;
  time: number;
  score: number;
  attempts: number;
  setAt: number | null;
  character: Character | null;
  subWeapon: ItemDto | null;
}

export interface EventInfo {
  eventId: number;
  endsAt: number;
  leaderboard: LeaderboardEntry[];
  worldRecord: LeaderboardEntry | null;
  updatedAt: number;
  rule: RuleDto | null;
  character: Character | null;
  subWeapon: ItemDto | null;
}

export async function writeToDB(raw: EventInfoDto, event: BrazenApiEventInfo) {
  const worldRecord = event.worldRecord;
  let worldRecordId: number | null = null;
  if (worldRecord) {
    const worldRecordUser = worldRecord.user;
    const [{ worldRecordUserId }] = await useDrizzle()
      .insert(userTable)
      .values({
        userKey: worldRecordUser.userKey,
        name: worldRecordUser.name,
        iconId: worldRecordUser.iconId,
        iconFrameId: worldRecordUser.iconFrameId,
      })
      .onConflictDoUpdate({
        target: userTable.userKey,
        set: {
          name: worldRecordUser.name,
          iconId: worldRecordUser.iconId,
          iconFrameId: worldRecordUser.iconFrameId,
        },
      })
      .returning({ worldRecordUserId: userTable.id });

    const result = await useDrizzle()
      .insert(scoreTable)
      .values({
        userId: worldRecordUserId,
        place: worldRecord.place,
        time: worldRecord.time,
        score: worldRecord.score,
        attempts: worldRecord.attempts,
        setAt: worldRecord.setAt,
        ruleId: worldRecord.ruleId,
        characterId: worldRecord.characterId,
        subWeaponId: worldRecord.subWeaponId,
      })
      .returning({ worldRecordId: scoreTable.id });

    worldRecordId = result[0].worldRecordId;
  }

  const [{ weeklyId }] = await useDrizzle()
    .insert(weeklyTable)
    .values({
      eventId: event.eventId,
      ruleId: event.ruleId,
      characterId: event.characterId,
      subWeaponId: event.subWeaponId,
      worldRecordId: worldRecordId,
      endsAt: event.endsAt,
      raw: raw,
    })
    .returning({ weeklyId: weeklyTable.id });

  for (let i = 0; i < event.leaderboard.length; i++) {
    const score = event.leaderboard[i];
    const scoreUser = score.user;
    const scoreUserId = await updateUserInDB(scoreUser);

    const [{ scoreId }] = await useDrizzle()
      .insert(scoreTable)
      .values({
        userId: scoreUserId,
        place: score.place,
        time: score.time,
        score: score.score,
        attempts: score.attempts,
        setAt: score.setAt,
        ruleId: score.ruleId,
        characterId: score.characterId,
        subWeaponId: score.subWeaponId,
      })
      .returning({ scoreId: scoreTable.id });

    await useDrizzle().insert(weeklyScoreTable).values({
      weeklyId: weeklyId,
      scoreId: scoreId,
    });
  }

  console.log(`Created weekly ${weeklyId} to database.`);
}

export async function hasRecentEntry(maxAgeMs: number): Promise<boolean> {
  const weekly = await useDrizzle().query.weeklyTable.findFirst({
    where: gt(weeklyTable.createdAt, new Date(Date.now() - maxAgeMs)),
  });

  if (weekly === undefined) {
    return false;
  }
  return true;
}

export async function getLatest(): Promise<EventInfo | null> {
  const weekly: DBEventInfo | undefined =
    await useDrizzle().query.weeklyTable.findFirst({
      orderBy: [desc(weeklyTable.createdAt)],
      with: {
        worldRecord: {
          with: {
            user: true,
          },
        },
        weeklyScores: {
          with: {
            score: {
              with: {
                user: true,
              },
            },
          },
        },
        rule: true,
      },
    });
  if (weekly === undefined) {
    return null;
  }
  return eventInfoFromDB(weekly);
}

export async function getCurrentWeekly(): Promise<EventInfo | null> {
  const weekly: DBEventInfo | undefined =
    await useDrizzle().query.weeklyTable.findFirst({
      orderBy: [desc(weeklyTable.createdAt)],
      where: gt(weeklyTable.endsAt, Math.floor(Date.now() / 1000)),
      with: {
        worldRecord: {
          with: {
            user: true,
          },
        },
        weeklyScores: {
          with: {
            score: {
              with: {
                user: true,
              },
            },
          },
        },
        rule: true,
      },
    });
  if (weekly === undefined) {
    return null;
  }
  return eventInfoFromDB(weekly);
}

export async function getEventInfoByEventId(
  eventId: number
): Promise<EventInfo | null> {
  const weekly: DBEventInfo | undefined =
    await useDrizzle().query.weeklyTable.findFirst({
      where: eq(weeklyTable.eventId, eventId),
      orderBy: [desc(weeklyTable.createdAt)],
      with: {
        worldRecord: {
          with: {
            user: true,
          },
        },
        weeklyScores: {
          with: {
            score: {
              with: {
                user: true,
              },
            },
          },
        },
        rule: true,
      },
    });

  if (weekly === undefined) {
    return null;
  }
  return await eventInfoFromDB(weekly);
}

export interface LeaderboardGraph {
  eventId: number;
  players: LeaderboardGraphPlayer[];
}

export interface LeaderboardGraphPlayer {
  name: string;
  scores: LeaderboardGraphScore[];
  lastKnownPosition: number;
}

export interface LeaderboardGraphScore {
  place: number;
  score: number;
  time: number;
  timestamp: number;
}

interface HistoryItem {
  leaderboardId: number | null;
  eventId: number | null;
  createdAt: Date | null;
  place: number | null;
  time: number | null;
  score: number | null;
  player: string | null;
}

export async function getLeaderboardHistoryByEventId(
  eventId: number
): Promise<LeaderboardGraph> {
  const history: HistoryItem[] = await useDrizzle()
    .select({
      leaderboardId: weeklyTable.id,
      eventId: weeklyTable.eventId,
      createdAt: weeklyTable.createdAt,
      place: scoreTable.place,
      time: scoreTable.time,
      score: scoreTable.score,
      player: userTable.name,
    })
    .from(weeklyScoreTable)
    .leftJoin(weeklyTable, eq(weeklyTable.id, weeklyScoreTable.weeklyId))
    .leftJoin(scoreTable, eq(scoreTable.id, weeklyScoreTable.scoreId))
    .leftJoin(userTable, eq(userTable.id, scoreTable.userId))
    .orderBy(
      desc(weeklyTable.eventId),
      asc(weeklyTable.createdAt),
      asc(scoreTable.place)
    )
    .where(eq(weeklyTable.eventId, eventId));

  const playerNames: string[] = [
    ...new Set(history.map((item) => item.player)),
  ].filter((item) => item !== null);

  const players: LeaderboardGraphPlayer[] = playerNames.map((name) => ({
    name: name,
    scores: [],
    lastKnownPosition: 99,
  }));

  const snapshots = history.reduce<Record<string, HistoryItem[]>>(
    (groups, item) => {
      const key = "" + item.leaderboardId;
      const group = groups[key] || [];
      group.push(item);
      groups[key] = group;
      return groups;
    },
    {}
  );

  Object.values(snapshots).forEach((snapshot) => {
    players.forEach((player) => {
      const historyItem = snapshot.find(
        (history) => history.player === player.name
      );
      if (
        historyItem &&
        historyItem.place !== null &&
        historyItem.score !== null &&
        historyItem.time !== null &&
        historyItem.createdAt !== null
      ) {
        player.scores.push({
          place: historyItem.place,
          score: historyItem.score,
          time: historyItem.time,
          timestamp: historyItem.createdAt.getTime(),
        });
        player.lastKnownPosition = historyItem.place;
      }
    });
  });

  return {
    eventId: eventId,
    players: players.toSorted(
      (a, b) => a.lastKnownPosition - b.lastKnownPosition
    ),
  };
}

interface DBScoreWithMetadata extends DBScore {
  user: DBUser;
}

interface DBEventInfo extends DBWeekly {
  worldRecord: DBScoreWithMetadata | null;
  weeklyScores: (DBWeeklyScore & {
    score: DBScoreWithMetadata;
  })[];
  rule: DBRule | null;
  characterId: number | null;
  subWeaponId: number | null;
}
async function eventInfoFromDB(weekly: DBEventInfo): Promise<EventInfo> {
  let worldRecord: LeaderboardEntry | null = null;

  const gameVersion = useRuntimeConfig().gameVersionCode;
  const characters = await getCharactersByGameVersion(gameVersion);
  const items = await getItemsByGameVersion(gameVersion);

  if (weekly.worldRecord) {
    worldRecord = {
      place: 1,
      user: {
        id: weekly.worldRecord.user.id,
        name: weekly.worldRecord.user.name,
        userKey: weekly.worldRecord.user.userKey,
        iconFrameId: weekly.worldRecord.user.iconFrameId,
        iconId: weekly.worldRecord.user.iconId,
      },
      time: weekly.worldRecord.time,
      score: weekly.worldRecord.score,
      attempts: weekly.worldRecord.attempts,
      setAt: weekly.worldRecord.setAt,
      character: characters[weekly.worldRecord.characterId || 0] || null,
      subWeapon: items[weekly.worldRecord.subWeaponId || 0] || null,
    };
  }

  let character: Character | null = null;
  if (weekly.characterId !== null && weekly.characterId > 0) {
    character = await getCharacterByCharacterId(weekly.characterId);
  }

  let subWeapon: Item | null = null;
  if (weekly.subWeaponId !== null && weekly.subWeaponId > 0) {
    subWeapon = await getItemByItemId(weekly.subWeaponId);
  }

  return {
    eventId: weekly.eventId,
    rule: weekly.rule,
    character: character,
    subWeapon: subWeapon,
    endsAt: weekly.endsAt,
    leaderboard: weekly.weeklyScores.map((row) => {
      return {
        place: row.score.place,
        user: {
          id: row.score.user.id,
          name: row.score.user.name,
          userKey: row.score.user.userKey,
          iconFrameId: row.score.user.iconFrameId,
          iconId: row.score.user.iconId,
        },
        time: row.score.time,
        score: row.score.score,
        attempts: row.score.attempts,
        setAt: row.score.setAt,
        character: characters[row.score.characterId || 0] || null,
        subWeapon: items[row.score.subWeaponId || 0] || null,
      };
    }),
    worldRecord: worldRecord,
    updatedAt: weekly.createdAt.getTime(),
  };
}
