<template>
  <Panel
    header="Brazen Hub changes"
    :pt="{ contentWrapper: { class: 'min-w-0' } }"
  >
    <div
      className="prose dark:prose-invert max-w-none prose-sm prose-headings:mt-0 prose-code:before:hidden prose-code:after:hidden"
    >
      <ContentRenderer v-if="data" :value="data" :components="headings" />
    </div>
  </Panel>
</template>

<script setup>
import ChangelogH3 from "./content/ChangelogH3.vue";

const headings = {
  h3: ChangelogH3,
};

const { data } = await useAsyncData(`changelog-home`, () => {
  return queryCollection("changelog").path(`/home`).first();
});
</script>
