<template>
  <div v-if="eventInfo?.event">
    <p class="my-4">
      Ends
      <NuxtTime :datetime="new Date(eventInfo.event.endsAt * 1000)" relative />
      -
      <NuxtTime
        :datetime="new Date(eventInfo.event.endsAt * 1000)"
        date-style="full"
        time-style="short"
        :hour12="false"
      />
    </p>
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
const { data: eventInfo } = await useFetch("/api/weekly");
</script>
