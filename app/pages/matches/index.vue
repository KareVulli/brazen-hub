<template>
  <MatchList v-if="data" :matches="data" />
</template>

<script setup lang="ts">
const { data } = await useFetch("/api/matches");
</script>
