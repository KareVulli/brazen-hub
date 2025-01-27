import type { BrazenApiPublicRoom } from "../../utils/brazen-api/getPublicRooms";
import { getPublicRooms } from "../../utils/brazen-api/getPublicRooms";
import { getCurrentWeekly } from "../../utils/eventInfo";
import type { BrazenUser } from "../../utils/user";
import { getUserFromDB } from "../../utils/user";

export interface HomePublicRoom extends BrazenApiPublicRoom {
  user: BrazenUser | null;
}

export interface HomeInfo {
  weekly: EventInfo | null;
  publicRooms: HomePublicRoom[];
}

async function publicRoomsToHomePublicRooms(
  bzToken: string,
  publicRooms: BrazenApiPublicRoom[]
): Promise<HomePublicRoom[]> {
  const homePublicRooms: HomePublicRoom[] = [];
  for (let i = 0; i < publicRooms.length; i++) {
    const room = publicRooms[i];
    let user = await getUserFromDB(room.createdByUserKey);
    if (!user) {
      user = await fetchAndUpdateUser(bzToken, room.createdByUserKey);
    }
    homePublicRooms.push({
      user: user,
      ...room,
    });
  }
  return homePublicRooms;
}

export default cachedEventHandler(
  async (event): Promise<HomeInfo> => {
    const config = useRuntimeConfig(event);

    const publicRooms = await getPublicRooms(config.bzToken);
    return {
      weekly: await getCurrentWeekly(),
      publicRooms: await publicRoomsToHomePublicRooms(
        config.bzToken,
        publicRooms
      ),
    };
  },
  {
    maxAge: 60,
    swr: false,
  }
);
