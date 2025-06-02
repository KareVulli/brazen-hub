<template>
  <div class="flex flex-col justify-between lg:flex-row gap-4">
    <PageTitle title="Weekly Challenges" />
    <AuthState v-slot="{ loggedIn, user }">
      <Button
        v-if="loggedIn && user?.role === ROLE_ADMIN"
        label="Try to update from Brazen Blaze"
        icon="pi pi-refresh"
        size="small"
        severity="secondary"
        @click="refetch"
      />
    </AuthState>
  </div>
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
import { UpdateStatus } from "~~/types/UpdateStatus";
import { ROLE_ADMIN } from "~~/server/database/roles";
import type { ToastMessageOptions } from "primevue";

const toast = useToast();

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

async function refetch() {
  const result = await $fetch("/api/data/weekly/update", {
    method: "GET",
  });

  let message: string;
  let severity: ToastMessageOptions["severity"];
  switch (result.status) {
    case UpdateStatus.UP_TO_DATE:
      severity = "info";
      message =
        "Recent information recently fetched, please wait a bit before trying again";
      break;
    case UpdateStatus.NO_NEW_EVENT:
      severity = "warn";
      message = "No active weekly challenge at this time";
      break;
    case UpdateStatus.UPDATED:
      severity = "success";
      message = "Received new scores, refresh the page to see them";
      break;
    default:
      severity = "error";
      message = `Received unknown status ${result.status}`;
  }

  toast.add({
    severity: severity,
    summary: "Refetch",
    detail: message,
    life: 3000,
  });
}
</script>
