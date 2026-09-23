<script setup lang="ts">
defineProps<{ showInvite?: boolean }>();

const config = useRuntimeConfig();
const statsbot: BrazenUser = {
  id: -1,
  name: config.public.statsbotUsername,
  userKey: config.public.statsbotUserKey,
  iconId: 21020000,
  iconFrameId: 21030000,
};
</script>

<template>
  <AuthState v-slot="{ loggedIn }">
    <div v-if="loggedIn">
      <CreateWatcherForm />
    </div>
    <div v-else>
      <AppLink
        class="hover:underline font-semibold"
        to="/auth/discord"
        external
      >
        Log in
      </AppLink>
      to add StatsBot for recording your custom matches
    </div>
    <template v-if="showInvite">
      <Divider class="my-2">or</Divider>
      <div class="flex gap-1 flex-wrap">
        Follow
        <LinkedUserName
          class="text-primary-500"
          :user="statsbot"
          variant="small"
          inline
        />
        in game and invite it to your room!
      </div>
    </template>
  </AuthState>
</template>
