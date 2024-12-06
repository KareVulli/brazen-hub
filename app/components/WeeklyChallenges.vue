<template>
  <div v-if="eventInfo">
    <p class="my-4">
      Ends
      <NuxtTime :datetime="new Date(eventInfo.endsAt * 1000)" relative />
      -
      <NuxtTime
        :datetime="new Date(eventInfo.endsAt * 1000)"
        date-style="full"
        time-style="short"
        :hour12="false"
      />
    </p>
    <LeaderboardTable :entries="eventInfo.leaderboard" />
    <h3 class="my-4">All time world record:</h3>
    <LeaderboardTable :entries="[eventInfo.worldRecord]" />
  </div>
</template>

<script setup lang="ts">
const { data: eventInfo } = await useFetch("/api/weekly");
</script>
