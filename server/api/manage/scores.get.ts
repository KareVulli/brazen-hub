import { ROLE_ADMIN } from "~~/server/database/roles";
import type { CustomScore } from "~~/server/utils/score";
import { getCustomScores } from "~~/server/utils/score";

export default defineEventHandler(
  async (event): Promise<{ scores: CustomScore[] }> => {
    const session = await requireUserSession(event);

    if (session.user.role !== ROLE_ADMIN) {
      throw createError({
        statusCode: 403,
        message: `Forbidden`,
      });
    }

    return {
      scores: await getCustomScores(),
    };
  }
);
