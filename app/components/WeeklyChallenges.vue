<template>
  <h1 class="mb-4 text-lg">Weekly Challenges</h1>
  <div class="flex flex-col lg:flex-row gap-4">
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
    <div class="flex-grow">
      <h1 class="mb-4 text-lg">
        Weekly Challenge - {{ selectedEvent ? selectedEvent.eventName : "" }}
      </h1>
      <WeeklyChallenge :event-id="props.eventId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EventListItem } from "~~/server/utils/eventsList";

const props = defineProps<{
  events: EventListItem[];
  eventId?: string;
}>();

const selectedEvent = computed(() => {
  if (props.eventId !== undefined) {
    const eventId = Number.parseInt(props.eventId);
    return props.events.find((event) => event.eventId === eventId);
  } else if (props.events.length) {
    return props.events[0];
  } else {
    return null;
  }
});

const items = computed(() =>
  props.events.map((event) => {
    let eventName = event.eventName;
    if (Date.now() < event.endsAt * 1000) {
      eventName += " - Live!";
    }
    return {
      label: eventName,
      route: `/weekly-challenges/${event.eventId}`,
    };
  })
);
</script>

<style>
/* Create custom classes for the active element */
.p-menu-item-active {
  color: var(--p-menu-item-focus-color) !important;
  background: var(--p-menu-item-focus-background) !important;
}
</style>
