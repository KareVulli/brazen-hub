<template>
  <div className="prose dark:prose-invert max-w-none pb-8">
    <ContentRenderer v-if="data" :value="data" />
  </div>
</template>

<script setup>
const slug = useRoute().params.slug.join("/");
const { data } = await useAsyncData(`wiki-${slug}`, () => {
  return queryCollection("wiki").path(`/${slug}`).first();
});

if (!data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page Not Found",
    fatal: true,
  });
}
</script>
