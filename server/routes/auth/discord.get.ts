import { ROLE_USER } from "~~/server/db/roles";
import { updateAccountInDB } from "~~/server/utils/account";

export default defineOAuthDiscordEventHandler({
  config: {
    emailRequired: false,
    scope: ["identify"],
  },
  async onSuccess(event, { user }) {
    const displayName = user.global_name || user.username;
    const account = await updateAccountInDB({
      discordId: user.id,
      username: user.username,
      displayName,
    });
    await setUserSession(event, {
      user: {
        discordId: user.id,
        username: user.username,
        displayName,
        avatar: user.avatar,
        role: account?.role || ROLE_USER,
      },
    });
    return sendRedirect(event, "/");
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error("Discord OAuth error:", error);
    return sendRedirect(event, "/");
  },
});
