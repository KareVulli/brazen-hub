import { getPrivateMatchRoomStatus } from "~~/server/utils/brazen-api/getPrivateMatchRoomStatus";
import {
  matchInvitationAccept,
  MatchInvitationError,
  MatchInvitationErrorReason,
} from "~~/server/utils/brazen-api/matchInvitationAccept";
import { getHostsByUserKeys } from "~~/server/utils/host";
import { createWatcher } from "~~/server/utils/roomSession";
import { watcherSchema } from "~~/validation/watcherSchema";

export default defineEventHandler(async (event): Promise<void> => {
  await requireUserSession(event);

  const data = await readValidatedBody(event, watcherSchema.parse);

  const host = await getFreeHost(); // FIXME: Race condition

  let invitation;
  try {
    invitation = await matchInvitationAccept(host.token, data.code);
  } catch (error) {
    if (error instanceof MatchInvitationError) {
      switch (error.reason) {
        case MatchInvitationErrorReason.MATCH_IN_PROGRESS:
          throw createError({
            statusCode: 400,
            statusMessage: `Match in progress`,
          });
        case MatchInvitationErrorReason.ROOM_FULL:
          throw createError({
            statusCode: 400,
            statusMessage: `Room full`,
          });
        default:
          throw createError({
            statusCode: 400,
            statusMessage: `Invalid room code`,
          });
      }
    }
    throw error;
  }

  if (invitation.GroupType !== "private_match_room") {
    throw createError({
      statusCode: 400,
      message: `Unsupported match type`,
    });
  }

  const privateMatchRoom = await getPrivateMatchRoomStatus(
    host.token,
    invitation.GroupId,
  );
  const playerUserKeys = privateMatchRoom.players
    .map((player) => player.userKey)
    .filter((key) => key !== host.userKey);
  const existingWatchers = await getHostsByUserKeys(playerUserKeys);
  if (existingWatchers.length) {
    throw createError({
      statusCode: 400,
      message: `Room already has a watcher`,
    });
  }

  await createWatcher(host, privateMatchRoom);
});
