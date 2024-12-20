import type { H3Event } from "h3";

export function checkAllowedToUpdate(event: H3Event) {
  const config = useRuntimeConfig(event);
  const authorization = getRequestHeader(event, "authorization");

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
