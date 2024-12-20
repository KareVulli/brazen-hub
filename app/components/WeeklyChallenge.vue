<template>
  <div v-if="eventInfo?.event">
    <div class="grid 2xl:grid-cols-2">
      <div>
        <p class="mb-4">
          <template v-if="eventInfo.event.endsAt * 1000 > Date.now()">
            Currently live! Ends
            <NuxtTime
              :datetime="new Date(eventInfo.event.endsAt * 1000)"
              relative
            />.
          </template>
        </p>
        <p class="mb-4">
          <NuxtTime
            :datetime="
              $dayjs(eventInfo.event.endsAt * 1000)
                .subtract(7, 'days')
                .toDate()
            "
            date-style="full"
            time-style="short"
          />
          -
          <NuxtTime
            :datetime="new Date(eventInfo.event.endsAt * 1000)"
            date-style="full"
            time-style="short"
          />
        </p>
      </div>
      <div class="2xl:text-right">
        <p class="mb-4">
          <template v-if="eventInfo.event.endsAt * 1000 > Date.now()">
            Last updated:
            <NuxtTime
              :datetime="new Date(eventInfo.event.updatedAt)"
              date-style="full"
              time-style="short"
            />.
          </template>
        </p>
      </div>
    </div>
    <LeaderboardTable :entries="eventInfo.event.leaderboard" />
    <template v-if="eventInfo.event.worldRecord !== null">
      <h3 class="my-4">All time world record:</h3>
      <LeaderboardTable :entries="[eventInfo.event.worldRecord]" />
    </template>
  </div>
  <div v-else>
    <p class="my-4">No event currently active.</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  eventId?: string;
}>();
const { data: eventInfo } = await useFetch(
  props?.eventId ? `/api/weekly/${props.eventId}` : "/api/weekly"
);
</script>
