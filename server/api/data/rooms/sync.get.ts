import { checkAllowedToUpdate } from "~~/server/utils/auth";

export default eventHandler(async (event): Promise<{ count: number }> => {
  await checkAllowedToUpdate(event);

  const rooms = await useDrizzle().query.roomTable.findMany({
    with: { host: true },
  });

  console.log(`Syncing ${rooms.length} rooms...`);

  const promises: Promise<unknown>[] = [];

  for (let i = 0; i < rooms.length; i++) {
    const room = rooms[i];
    promises.push(
      syncPrivateMatchRoom(room.host.token, {
        PrivateMatchRoomId: room.matchId,
        LeaderUserKey: room.host.userKey,
        Players: [{ UserKey: room.host.userKey }],
        Visibility: room.public
          ? RoomVisibility.Public
          : RoomVisibility.Private,
        VoiceChatSettings: 1,
        GameRuleId: room.gameRuleId,
        StageId: room.stageId,
        SupportItemsSettings: 0,
        RoomTagId: 1,
      })
    );
  }

  await Promise.all(promises);

  return { count: rooms.length };
});
