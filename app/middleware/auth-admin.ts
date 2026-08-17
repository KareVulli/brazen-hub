import { ROLE_ADMIN } from "~~/server/db/roles";

export default defineNuxtRouteMiddleware(() => {
  const { loggedIn, user } = useUserSession();
  if (!loggedIn.value || user.value?.role !== ROLE_ADMIN) {
    return navigateTo("/");
  }
});
