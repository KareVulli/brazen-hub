<template>
  <WeeklyChallenges
    v-if="eventList"
    :events="eventList.events"
    :event-id="eventId"
  />
</template>

<script setup lang="ts">
const route = useRoute();

const eventId = computed(() => {
  if (typeof route.params.id === "string") {
    return route.params.id;
  }
  return undefined;
});
const { data: eventList } = await useFetch("/api/weeklies");
</script>
