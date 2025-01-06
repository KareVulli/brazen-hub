<template>
  <TargetChallenges v-if="data" :rulesets="data.rulesets" />
</template>

<script setup lang="ts">
const { data } = await useFetch("/api/target-challenges");
</script>
