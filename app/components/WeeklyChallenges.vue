<template>
  <h1 class="mb-4 text-lg">Weekly Challenges</h1>
  <div class="card flex justify-center">
    <SelectButton
      v-model="value"
      :options="props.events.toReversed()"
      :option-value="(option: EventListItem) => option.eventId"
      :option-label="(option: EventListItem) => `${dayjs(option.endsAt * 1000).subtract(7, 'days').format('YYYY-MM-DD')} - ${dayjs(option.endsAt * 1000).format('YYYY-MM-DD')}` "
    />
  </div>
  <h1 class="mb-4 text-lg">Weekly Challenge - Week 3</h1>
  <WeeklyChallenge />
</template>

<script setup lang="ts">
import dayjs from "#build/dayjs.imports.mjs";
import type { EventListItem } from "~~/server/utils/eventsList";

const props = defineProps<{
  events: EventListItem[];
}>();

const value = ref(props.events[0]?.eventId);
</script>
