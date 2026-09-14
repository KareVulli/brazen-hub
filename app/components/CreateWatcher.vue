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
      <template v-if="showInvite">
        <Divider>or</Divider>
        <p class="flex gap-1 flex-wrap">
          Follow
          <LinkedUserName
            class="text-primary-500"
            :user="statsbot"
            variant="small"
            inline
          />
          in game and invite it to your room!
        </p>
      </template>
    </div>
    <Message v-else>
      <a href="/auth/discord" class="hover:underline font-semibold">Log in</a>
      to add StatsBot for recording your custom matches
    </Message>
  </AuthState>
</template>
