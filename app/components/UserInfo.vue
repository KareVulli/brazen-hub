<template>
  <Panel :header="`User ID: ${user.user.userKey}`">
    <div class="flex items-center gap-2">
      <UserName :user="user.user" />
      <span>-</span>
      <span
        >Currently
        <span v-if="user.user.online" class="text-green-500 font-bold">
          online
        </span>
        <span v-else>offline</span></span
      >
    </div>
  </Panel>
  <Panel header="Known best Target Challenge scores">
    <TopScoreTable :scores="user.topScores" />
  </Panel>
</template>

<script setup lang="ts">
import type { SearchUserResult } from "~~/server/api/search-user.get";

defineProps<{ user: SearchUserResult }>();
</script>
