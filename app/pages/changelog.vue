<template>
  <div className="prose dark:prose-invert max-w-none pb-8">
    <ContentRenderer v-if="data" :value="data" />
  </div>
</template>

<script setup>
useHead({
  title: "Changelog",
});

const { data } = await useAsyncData(`changelog-full`, () => {
  return queryCollection("changelog").path(`/full`).first();
});
</script>
