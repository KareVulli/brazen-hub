import { z } from "zod";
import { getDetailedCharacterByCharacterId } from "~~/server/utils/character";
import type { DetailedCharacter } from "~~/server/utils/character";

const requestSchema = z.object({
  id: z.coerce.number().positive().int(),
});

export default cachedEventHandler(
  async (event): Promise<DetailedCharacter> => {
    const { id } = await getValidatedRouterParams(event, requestSchema.parse);

    const character = await getDetailedCharacterByCharacterId(id);

    if (character === null) {
      throw createError({
        statusCode: 404,
        message: `Did not find character with id ${id}.`,
      });
    }
    return character;
  },
  {
    maxAge: 60,
    swr: false,
  },
);
