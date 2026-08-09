export interface PrivateMatchRoomStatusDto {
  PrivateMatchRoom: PrivateMatchRoomDto;
}

async function getPrivateMatchRoomStatusRequest(
  token: string,
  privateMatchRoomId: string,
): Promise<PrivateMatchRoomStatusDto> {
  return await brazenMessagePackApiRequest<PrivateMatchRoomStatusDto>(
    `match/v1/private_match_room/status?private_match_room_id=${encodeURIComponent(privateMatchRoomId)}`,
    "GET",
    { Authorization: `Bearer ${token}` },
  );
}

export async function getPrivateMatchRoomStatus(
  token: string,
  privateMatchRoomId: string,
): Promise<BrazenAPIRoom> {
  return brazenApiRoomFromPrivateMatchRoomDto(
    (await getPrivateMatchRoomStatusRequest(token, privateMatchRoomId))
      .PrivateMatchRoom,
  );
}
