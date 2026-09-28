<template>
  <Message v-if="data?.maintenance" severity="warn" class="mb-4">
    Brazen Hub is currently in maintenance mode. Some functionality may have
    issues.
  </Message>
  <Message v-if="data?.matchmakingMaintenance" severity="warn" class="mb-4">
    StatsBot is currently in maintenance mode and may not be available.
  </Message>
</template>

<script setup lang="ts">
const { data } = useFetch("/api/home/status", { key: "home-status" });
</script>
