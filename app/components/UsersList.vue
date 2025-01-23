<template>
  <div>
    <p class="mb-4">Found multiple matches. Please select one:</p>
    <Menu :model="items">
      <template #item="{ item, props: itemProps }">
        <NuxtLink
          v-if="item.route"
          v-slot="{ href, navigate }"
          :to="item.route"
          custom
        >
          <a
            v-ripple
            :href="href"
            v-bind="itemProps.action"
            class="flex items-center"
            @click="navigate"
          >
            <div class="mr-auto">
              <UserName :user="item.user" show-key />
            </div>
            <span v-if="item.user.online" class="text-green-500 font-bold">
              online
            </span>
            <span v-else>offline</span>
          </a>
        </NuxtLink>
      </template>
    </Menu>
  </div>
</template>

<script setup lang="ts">
import type { MenuItem } from "primevue/menuitem";
import type { BrazenAPIDetailedUser } from "~~/server/utils/brazen-api/models/apiUser";

const props = defineProps<{
  users: BrazenAPIDetailedUser[];
}>();

const items = computed((): MenuItem[] => {
  return props.users.map((user) => ({
    label: user.name,
    route: { path: "/search-user", query: { query: user.userKey } },
    user: user,
  }));
});
</script>

<style>
/* Create custom classes for the active element */
.p-menu-item-active {
  color: var(--p-menu-item-focus-color) !important;
  background: var(--p-menu-item-focus-background) !important;
}
</style>
