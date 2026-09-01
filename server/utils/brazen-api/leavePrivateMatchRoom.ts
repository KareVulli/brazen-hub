import { unpack } from "msgpackr";
import { brazenMessagePackApiRequest } from "./client";
import { FetchError } from "ofetch";
import type { PrivateMatchRoomDto } from "./dtos/privateMatchRoomDto";

interface PrivateMatchRoomLeaveDto {
  PrivateMatchRoom: PrivateMatchRoomDto;
}

export async function leavePrivateMatchRoom(
  token: string,
  privateMatchRoomId: string,
): Promise<BrazenAPIRoom> {
  const response = await brazenMessagePackApiRequest<PrivateMatchRoomLeaveDto>(
    "match/v1/private_match_room/leave",
    "POST",
    { Authorization: `Bearer ${token}` },
    {
      PrivateMatchRoomId: privateMatchRoomId,
    },
  );
  return brazenApiRoomFromPrivateMatchRoomDto(response.PrivateMatchRoom);
}
