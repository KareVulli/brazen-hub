<template>
  <WeeklyChallenges
    v-if="eventList"
    :events="eventList.events"
    :show-chart="true"
  />
</template>

<script setup lang="ts">
const { data: eventList } = await useFetch("/api/weeklies");
</script>
