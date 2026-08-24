<template>
  <AuthState v-slot="{ loggedIn }">
    <div v-if="loggedIn">
      <CreateWatcherForm />
    </div>
    <Message v-else
      ><a href="/auth/discord" class="hover:underline font-semibold">Log in</a>
      to add StatsBot for recording your custom matches</Message
    >
  </AuthState>
</template>
