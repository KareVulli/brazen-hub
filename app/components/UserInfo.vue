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
  <MatchesOverview :matches="user.recentMatches" />
  <Panel header="Known best Target Challenge scores">
    <UserScoreTable :scores="user.topScores" />
  </Panel>
</template>

<script setup lang="ts">
import type { SearchUserResult } from "~~/server/api/search-user.get";

defineProps<{ user: SearchUserResult }>();
</script>
