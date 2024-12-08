<template>
  <div class="container mx-auto px-4 py-4">
    <Menubar :model="items">
      <template #start>
        <div class="font-bold mx-4">Brazen Hub</div>
      </template>
      <template #item="{ item, props }">
        <NuxtLink v-slot="{ href, navigate, isActive }" :to="item.route" custom>
          <a
            v-ripple
            :class="isActive ? 'p-menubar-item-active rounded-md' : ''"
            :href="href"
            v-bind="props.action"
            @click="navigate"
          >
            <span>{{ item.label }}</span>
          </a>
        </NuxtLink>
      </template>
    </Menubar>
  </div>
  <div class="container mx-auto px-4">
    <NuxtLoadingIndicator />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "NuxtHub Starter",
  description:
    "A Nuxt template to build your full-stack application on the edge.",
});

const items = ref([
  {
    label: "Weekly challenges",
    route: "/weekly-challenges",
  },
  {
    label: "Target challenges",
    route: "/target-challenges",
  },
  {
    label: "Round team matches",
    route: "/rtm",
  },
]);
</script>

<style>
/* Create custom classes for the active element */
.p-menubar-item-active {
  color: var(--p-menubar-item-active-color) !important;
  background: var(--p-menubar-item-active-background) !important;
}
</style>
