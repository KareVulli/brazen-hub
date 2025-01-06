<template>
  <Menu :model="items">
    <template #item="{ item, props }">
      <NuxtLink
        v-if="item.route"
        v-slot="{ href, navigate, isActive }"
        :to="item.route"
        exact-active-class="p-menu-item-active"
        custom
      >
        <a
          v-ripple
          :class="isActive ? 'p-menu-item-active rounded-md' : ''"
          :href="href"
          v-bind="props.action"
          @click="navigate"
        >
          <span>{{ item.label }}</span>
        </a>
      </NuxtLink>
      <a
        v-else
        v-ripple
        :href="item.url"
        :target="item.target"
        v-bind="props.action"
      >
        <span>{{ item.label }}</span>
      </a>
    </template>
  </Menu>
</template>

<script setup lang="ts">
import type { MenuItem } from "primevue/menuitem";

defineProps<{
  items: MenuItem[] | undefined;
}>();
</script>

<style>
/* Create custom classes for the active element */
.p-menu-item-active {
  color: var(--p-menu-item-focus-color) !important;
  background: var(--p-menu-item-focus-background) !important;
}
</style>
