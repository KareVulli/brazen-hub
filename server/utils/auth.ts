import type { H3Event } from "h3";
import { ROLE_ADMIN } from "../database/roles";

export async function checkAllowedToUpdate(event: H3Event): Promise<void> {
  const config = useRuntimeConfig(event);
  const authorization = getRequestHeader(event, "authorization");
  const session = await getUserSession(event);

  if (session.user && session.user.role === ROLE_ADMIN) {
    return;
  }

  if (
    config.updateToken === "" ||
    authorization !== `Token ${config.updateToken}`
  ) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }
}
