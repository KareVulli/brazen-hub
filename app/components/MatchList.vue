<template>
  <PageTitle title="Custom Matches" />

  <AuthState v-slot="{ loggedIn }">
    <div
      v-if="loggedIn"
      class="border-b border-surface-200 dark:border-surface-700 mb-4 pb-4"
    >
      <CreateWatcherForm />
    </div>
    <Message v-else class="mb-4"
      ><a href="/auth/discord" class="hover:underline font-semibold">Log in</a>
      to add a watcher to your custom room</Message
    >
  </AuthState>
  <template v-if="matches.length">
    <PageTitle title="Match history" />
    <div class="grid gap-2 2xl:grid-cols-2">
      <MatchItem v-for="match in matches" :key="match.id" :match="match" />
    </div>
  </template>
  <template v-else>
    <p class="font-semibold mb-4">No custom matches yet</p>
    <p>
      Invite a watcher to record your custom matches by entering the room code
      to the form above.
    </p>
  </template>
</template>

<script setup lang="ts">
defineProps<{ matches: MatchDto[] }>();
</script>
