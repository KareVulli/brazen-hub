import { brazenMessagePackApiRequest } from "./client";

interface PrivateMatchRoomOpenDto {
  PrivateMatchRoom: PrivateMatchRoomDto;
}

async function openPrivateMatchRoomRequest(
  token: string,
  privateMatchRoomId: string,
): Promise<PrivateMatchRoomOpenDto> {
  return await brazenMessagePackApiRequest<PrivateMatchRoomOpenDto>(
    "match/v1/private_match_room/open",
    "POST",
    { Authorization: `Bearer ${token}` },
    { PrivateMatchRoomId: privateMatchRoomId },
  );
}

export async function openPrivateMatchRoom(
  token: string,
  privateMatchRoomId: string,
): Promise<BrazenAPIRoom> {
  return brazenApiRoomFromPrivateMatchRoomDto(
    (await openPrivateMatchRoomRequest(token, privateMatchRoomId))
      .PrivateMatchRoom,
  );
}
