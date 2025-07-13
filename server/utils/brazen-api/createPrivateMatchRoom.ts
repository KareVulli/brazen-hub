import { brazenMessagePackApiRequest } from "./client";
import type { PrivateMatchRoomDto } from "./dtos/privateMatchRoomDto";
import { brazenApiRoomFromPrivateMatchRoomDto } from "./dtos/privateMatchRoomDto";

interface PrivateMatchRoomCreateDto {
  PrivateMatchRoom: PrivateMatchRoomDto;
}

async function createRoomRequest(
  token: string
): Promise<PrivateMatchRoomCreateDto> {
  return await brazenMessagePackApiRequest<PrivateMatchRoomCreateDto>(
    "match/v1/private_match_room/create",
    "POST",
    { Authorization: `Bearer ${token}` },
    { PlayZone: "us", Latency: 100 }
  );
}

export async function createPrivateMatchRoom(
  token: string
): Promise<BrazenAPIRoom> {
  return brazenApiRoomFromPrivateMatchRoomDto(
    (await createRoomRequest(token)).PrivateMatchRoom
  );
}
