<template>
  <CharacterStats v-if="data" :characters="data" />
</template>

<script setup lang="ts">
const { data } = await useFetch("/api/characters");
</script>
