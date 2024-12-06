<template>
  <div class="container mx-auto px-4 py-4">
    <Menubar :model="items">
      <template #start>
        <div class="font-bold mx-4">Brazen Hub</div>
      </template>
      <template #item="{ item, props }">
        <NuxtLink
          v-if="item.route"
          v-slot="{ href, navigate }"
          :href="item.route"
          custom
        >
          <a v-ripple :href="href" v-bind="props.action" @click="navigate">
            <span>{{ item.label }}</span>
          </a>
        </NuxtLink>
        <NuxtLink
          v-else
          v-ripple
          :href="item.url"
          :target="item.target"
          v-bind="props.action"
        >
          <span>{{ item.label }}</span>
        </NuxtLink>
      </template>
    </Menubar>
  </div>
  <div class="container mx-auto px-4">
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
    route: "/",
  },
  {
    label: "Target challenges",
    route: "/target-challenges",
  },
]);
</script>
