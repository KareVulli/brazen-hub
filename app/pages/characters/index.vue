<template>
  <CharacterStats v-if="data" :characters="data" />
</template>

<script setup lang="ts">
useHead({
  title: "Characters",
});

const { data } = await useFetch("/api/characters");
</script>
