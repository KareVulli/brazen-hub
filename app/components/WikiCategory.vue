<template>
  <Card>
    <template #title>{{ title }}</template>
    <template #content
      ><PanelMenu :model="items" class="w-full mt-4">
        <template #item="{ item }">
          <NuxtLink v-slot="{ href, navigate }" :to="item.route" custom>
            <a v-ripple class="block px-2 py-1" :href="href" @click="navigate">
              {{ item.label }}
            </a>
          </NuxtLink>
        </template>
      </PanelMenu></template
    >
  </Card>
</template>

<script setup lang="ts">
import type { MenuItem } from "primevue/menuitem";

defineProps<{
  title: string;
  items: MenuItem[];
}>();
</script>
