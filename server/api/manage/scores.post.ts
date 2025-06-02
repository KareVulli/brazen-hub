import { ROLE_ADMIN } from "~~/server/database/roles";
import { writeScore } from "~~/server/utils/score";
import { scoreSchema } from "~~/validation/scoreSchema";

export default defineEventHandler(async (event): Promise<void> => {
  const session = await requireUserSession(event);

  if (session.user.role !== ROLE_ADMIN) {
    throw createError({
      statusCode: 403,
      message: `Forbidden`,
    });
  }
  const data = await readValidatedBody(event, scoreSchema.parse);

  const userKey = data.userId + "";

  const user = await getUserFromDB(userKey);
  if (user === null) {
    throw createError({
      statusCode: 400,
      message: `User not found`,
    });
  }

  const character = await getCharacterByCharacterId(data.characterId);
  if (character === null) {
    throw createError({
      statusCode: 400,
      message: `Character not found`,
    });
  }

  const rule = await getRuleById(data.ruleId);
  if (rule === null) {
    throw createError({
      statusCode: 400,
      message: `Rule not found`,
    });
  }

  const item = await getItemByItemId(data.subWeaponId);
  if (item === null) {
    throw createError({
      statusCode: 400,
      message: `Sub-weapon not found`,
    });
  }

  await writeScore({ ...data, attempts: -1, userId: user.id });
});
