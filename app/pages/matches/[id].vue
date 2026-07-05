<template>
  <MatchDetails v-if="matchId !== null" :match-id="matchId" />
</template>

<script setup lang="ts">
const route = useRoute();

const matchId = computed(() => {
  if (typeof route.params.id === "string") {
    return Number.parseInt(route.params.id);
  }
  return null;
});
</script>
