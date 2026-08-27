<template>
  <div class="mb-4 flex flex-row gap-2 items-center">
    <UserIcon :user="user.user" variant="large" />
    <div class="mr-auto">
      <h1 class="text-lg">{{ user.user.name }}</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
        ID: {{ user.user.userKey }}
      </p>
    </div>
    <span v-if="user.user.online" class="text-green-500 font-bold">
      Online
    </span>
    <span v-else>Offline</span>
  </div>
  <Panel
    v-if="user.recentMatches.length > 0"
    header="Stats"
    :pt="{ contentWrapper: { class: 'min-w-0' } }"
  >
    <p>
      KDR:
      <template v-if="user.stats.totalDeaths > 0">{{
        (user.stats.totalKills / user.stats.totalDeaths).toFixed(2)
      }}</template>
      <template v-else>{{ user.stats.totalKills.toFixed(2) }}</template>

      ({{ user.stats.totalKills }} kills / {{ user.stats.totalDeaths }} deaths)
    </p>
    <Message class="mt-4" variant="simple">
      <template #icon>
        <span class="pi pi-info-circle" />
      </template>
      Work in progress! More stats will be added later.</Message
    >
  </Panel>
  <UserMatches :user-key="user.user.userKey" :matches="user.recentMatches" />
  <Panel
    header="Known best Target Challenge scores"
    :pt="{ contentWrapper: { class: 'min-w-0' } }"
  >
    <UserScoreTable :scores="user.topScores" />
  </Panel>
</template>

<script setup lang="ts">
import type { SearchUserResult } from "~~/server/api/search-user.get";

defineProps<{ user: SearchUserResult }>();
</script>
