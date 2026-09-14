<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toast />
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (title) => {
    return title ? `${title} | Brazen Hub` : "Brazen Hub";
  },
});

useSeoMeta({
  description: "Statistics about Brazen Blaze",
});
</script>
