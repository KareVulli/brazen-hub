<template>
  <WeeklyChallenges v-if="eventList" :events="eventList.events" />
</template>

<script setup lang="ts">
const { data: eventList } = await useFetch("/api/weeklies");
</script>
