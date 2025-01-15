<template>
  <h1 class="mb-4 text-lg">Weekly Challenges</h1>
  <div class="flex flex-col lg:flex-row gap-4">
    <SideMenu :items="items" />
    <div class="flex-grow">
      <WeeklyChallenge
        :event-name="selectedEvent?.eventName"
        :event-id="props.eventId"
        :show-chart="showChart"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EventListItem } from "~~/server/utils/eventsList";

const props = defineProps<{
  events: EventListItem[];
  eventId?: string;
  showChart: boolean;
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
