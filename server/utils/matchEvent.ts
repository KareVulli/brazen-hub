import type { MatchEventSchema } from "~~/validation/matchEventSchema";
import { matchEventTable } from "../db/schema/matchEvent";
import type { DBMatchEvent } from "./drizzle";

type MatchEventType =
  | {
      name: "revive";
      data: {
        sourceUserKey: string | null;
        targetUserKey: string;
      };
    }
  | {
      name: "stun";
      data: {
        sourceUserKey: string | null;
        targetUserKey: string;
      };
    }
  | {
      name: "kill";
      data: {
        sourceUserKey: string | null;
        targetUserKey: string;
      };
    }
  | {
      name: "round-start";
      data: {
        round: number;
      };
    }
  | {
      name: "round-end";
      data: {
        teams: {
          [x: string]: {
            wins: number;
            placement: number;
          };
        };
        players: {
          [x: string]: {
            kills: number;
            stuns: number;
            deaths: number;
            revives: number;
            healed: number;
            skill: number;
            ultimate: number;
            damage: number;
            aliveDuration: number;
          };
        };
        round: number;
        winnerTeamIndex: number;
        startedAt: number;
        endedAt: number;
      };
    }
  | {
      name: "disconnect";
      data: {
        targetUserKey: string;
      };
      eventAt: number;
    }
  | {
      name: "error";
      data: {
        message: string;
      };
      eventAt: number;
    };

export type MatchEventDto = MatchEventType & {
  id: number;
  matchId: number;
  eventAt: number;
  createdAt: number;
};

export function matchEventToDto(event: DBMatchEvent): MatchEventDto {
  const eventPayload = { name: event.name, data: event.data } as MatchEventType;
  return {
    id: event.id,
    matchId: event.matchId,
    ...eventPayload,
    eventAt: Math.floor(event.eventAt.getTime() / 1000),
    createdAt: Math.floor(event.createdAt.getTime() / 1000),
  };
}

export async function createMatchEvent(
  matchId: number,
  event: MatchEventSchema,
): Promise<void> {
  const { eventAt, ...rest } = event;
  await useDrizzle()
    .insert(matchEventTable)
    .values({
      matchId: matchId,
      ...rest,
      eventAt: new Date(eventAt * 1000),
    });
}

export async function getMatchEventsByMatchId(
  matchId: number,
): Promise<DBMatchEvent[]> {
  return await useDrizzle().query.matchEventTable.findMany({
    where: eq(matchEventTable.matchId, matchId),
    orderBy: desc(matchEventTable.id),
  });
}
