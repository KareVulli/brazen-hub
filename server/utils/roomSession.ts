import { isNull } from "drizzle-orm";
import { roomSessionTable } from "../db/schema";
import type { BrazenAPIRoom } from "./brazen-api/models/apiRoom";
import { connectWatcher } from "./matchmaking-api/connectWatcher";
import type { DBRoomSession } from "./drizzle";

export interface RoomSession {
  id: number;
  matchId: string;
  marsRoomId: string;
  invitationCode: string;
  active: boolean;
  createdAt: Date;
}

export interface RoomSessionDto {
  id: number;
  matchId: string;
  marsRoomId: string;
  invitationCode: string;
  active: boolean;
  createdAt: number;
}

export interface WatcherSession {
  roomSession: RoomSession;
  matches: SimpleMatch[];
}

export interface WatcherSessionDto {
  roomSession: RoomSessionDto;
  matches: SimpleMatchDto[];
}

export function roomSessionToDto(roomSession: RoomSession): RoomSessionDto {
  return {
    id: roomSession.id,
    matchId: roomSession.matchId,
    marsRoomId: roomSession.marsRoomId,
    invitationCode: roomSession.invitationCode,
    active: roomSession.active,
    createdAt: Math.floor(roomSession.createdAt.getTime() / 1000),
  };
}

export function watcherSessionToDto(
  watcherSession: WatcherSession,
): WatcherSessionDto {
  return {
    roomSession: roomSessionToDto(watcherSession.roomSession),
    matches: watcherSession.matches.map(simpleMatchToDto),
  };
}

export async function getSessionById(
  id: number,
): Promise<DBRoomSession | null> {
  const session = await useDrizzle().query.roomSessionTable.findFirst({
    where: eq(roomSessionTable.id, id),
  });
  return session || null;
}

export async function createWatcher(
  host: DBHost,
  privateMatchRoom: BrazenAPIRoom,
): Promise<void> {
  const sessionId = (
    await useDrizzle()
      .insert(roomSessionTable)
      .values({
        hostId: host.id,
        matchId: privateMatchRoom.id,
        invitationCode: privateMatchRoom.invitationCode,
        marsRoomId: privateMatchRoom.marsRoomId,
        active: true,
      })
      .returning({ id: roomSessionTable.id })
  )[0]?.id;

  if (sessionId === undefined) {
    throw new Error("Failed to create room session");
  }

  await connectWatcher({
    hubSessionId: sessionId,
    userKey: host.userKey,
    hostToken: host.token,
    privateMatchRoomId: privateMatchRoom.id,
  });
}

export async function getWatcherSessions(): Promise<WatcherSession[]> {
  const results = await useDrizzle().query.roomSessionTable.findMany({
    where: isNull(roomSessionTable.roomId),
    with: {
      matches: {
        with: {
          teams: {
            with: {
              teamUsers: {
                with: {
                  user: true,
                  character: true,
                  subWeapon: true,
                },
              },
            },
          },
          stage: true,
          gameRule: true,
        },
      },
    },
    orderBy: desc(roomSessionTable.id),
  });

  return results.map(({ matches, ...session }) => ({
    roomSession: session,
    matches: matches,
  }));
}

export async function getWatcherSessionById(
  id: number,
): Promise<WatcherSession | null> {
  const result = await useDrizzle().query.roomSessionTable.findFirst({
    where: and(isNull(roomSessionTable.roomId), eq(roomSessionTable.id, id)),
    with: {
      matches: {
        with: {
          teams: {
            with: {
              teamUsers: {
                with: {
                  user: true,
                  character: true,
                  subWeapon: true,
                },
              },
            },
          },
          stage: true,
          gameRule: true,
        },
      },
    },
    orderBy: desc(roomSessionTable.id),
  });

  if (result) {
    const { matches, ...session } = result;
    return {
      roomSession: session,
      matches: matches,
    };
  }

  return null;
}

export async function closeWatcherSession(id: number): Promise<void> {
  await useDrizzle()
    .update(roomSessionTable)
    .set({ active: false })
    .where(and(isNull(roomSessionTable.roomId), eq(roomSessionTable.id, id)));
}
