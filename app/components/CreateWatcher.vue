<template>
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
</template>
