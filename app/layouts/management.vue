<template>
  <div>
    <div class="container mx-auto px-4 py-4">
      <Menubar :model="items">
        <template #start>
          <NuxtLink
            to="/"
            class="font-bold mx-4 text-cyan-500 hover:text-cyan-600 transition"
            >Brazen Hub - Management</NuxtLink
          >
        </template>
        <template #item="{ item, props }">
          <NuxtLink
            v-slot="{ href, navigate, isActive }"
            :to="item.route"
            custom
          >
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
        <template #end>
          <div class="flex items-center gap-2">
            <AuthState v-slot="{ loggedIn, clear, user }">
              <template v-if="loggedIn">
                <h1>Hey {{ user?.displayName }}!</h1>
                <Button
                  :as="NuxtLink"
                  label="Back to hub"
                  size="small"
                  to="/"
                />
                <Button label="Logout" size="small" @click="clear" />
              </template>
            </AuthState>
            <Button
              as="a"
              icon="pi pi-github"
              aria-label="Open Brazen Hub GitHub repository"
              href="https://github.com/KareVulli/brazen-hub"
              target="_blank"
              rel="noopener"
              variant="text"
              severity="contrast"
              size="small"
            />
          </div>
        </template>
      </Menubar>
    </div>
    <div class="container mx-auto px-4 mb-4">
      <NuxtLoadingIndicator />
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NuxtLink } from "#components";
import { ROLE_ADMIN } from "~~/server/database/roles";

const items = ref([
  {
    label: "Custom scores",
    route: "/manage",
  },
  {
    label: "Rooms",
    route: "/manage/rooms",
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
