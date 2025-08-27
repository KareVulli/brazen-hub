<template>
  <div>
    <div class="container mx-auto px-4 py-4">
      <Menubar :model="items">
        <template #start>
          <NuxtLink to="/" class="font-bold mx-4 hover:text-red-600 transition"
            >Brazen Hub</NuxtLink
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
                  v-if="user?.role == ROLE_ADMIN"
                  :as="NuxtLink"
                  label="Management"
                  size="small"
                  to="/manage"
                />
                <Button label="Logout" size="small" @click="clear" />
              </template>
              <Button
                v-else
                as="a"
                label="Log in with Discord"
                href="/auth/discord"
                size="small"
              />
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
    label: "Weekly challenges",
    route: "/weekly-challenges",
  },
  {
    label: "Target challenges",
    route: "/target-challenges",
  },
  {
    label: "Round team match",
    route: "/rtm",
  },
  {
    label: "Player search",
    route: "/search-user",
  },
  {
    label: "Characters",
    route: "/characters",
  },
  {
    label: "Wiki",
    route: "/wiki",
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
