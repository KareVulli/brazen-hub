import { unpack } from "msgpackr";
import { brazenMessagePackApiRequest } from "./client";
import { FetchError } from "ofetch";
interface InvitationAcceptTeamInfoDto {
  GameRule: string;
  GameRuleId: number;
  StageId: number;
  SupportItemsSettings: number;
}

export interface MatchInvitationAcceptDto {
  GroupType: string;
  GroupId: string;
  TeamInfo: InvitationAcceptTeamInfoDto | null;
}

export enum MatchInvitationErrorReason {
  INVALID_CODE,
  MATCH_IN_PROGRESS,
  ROOM_FULL,
}

export class MatchInvitationError extends Error {
  reason: MatchInvitationErrorReason;
  constructor(reason: MatchInvitationErrorReason) {
    super(`Could not accept invitation: ${MatchInvitationErrorReason[reason]}`);
    this.reason = reason;
  }
}

export async function matchInvitationAccept(
  token: string,
  code: string,
): Promise<MatchInvitationAcceptDto> {
  try {
    return await brazenMessagePackApiRequest<MatchInvitationAcceptDto>(
      "match/v1/invitation/accept",
      "POST",
      { Authorization: `Bearer ${token}` },
      {
        InvitationCode: code,
        InvitationId: null,
        PlayZone: "us",
        Latency: 100,
      },
    );
  } catch (error) {
    if (
      error instanceof FetchError &&
      error.statusCode === 400 &&
      error.data instanceof ArrayBuffer
    ) {
      const response = unpack(Buffer.from(error.data)) as unknown;
      if (
        typeof response === "object" &&
        response !== null &&
        "Code" in response
      ) {
        switch (response.Code) {
          case BigInt(267523):
            throw new MatchInvitationError(
              MatchInvitationErrorReason.ROOM_FULL,
            );
          case BigInt(267524):
            throw new MatchInvitationError(
              MatchInvitationErrorReason.MATCH_IN_PROGRESS,
            );
          default:
            throw new MatchInvitationError(
              MatchInvitationErrorReason.INVALID_CODE,
            );
        }
      }
    }
    throw error;
  }
}
