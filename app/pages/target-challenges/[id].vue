<template>
  <TargetChallenges
    v-if="data"
    :rulesets="data.rulesets"
    :ruleset-id="eventId"
  />
</template>

<script setup lang="ts">
const route = useRoute();

const eventId = computed(() => {
  if (typeof route.params.id === "string") {
    const id = Number.parseInt(route.params.id);
    if (!Number.isNaN(id)) {
      return id;
    }
  }
  return undefined;
});
const { data } = await useFetch("/api/target-challenges");
</script>
