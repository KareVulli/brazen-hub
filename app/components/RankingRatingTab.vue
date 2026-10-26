<template>
  <PageTitle title="Global Rating" />
  <p class="text-sm opacity-50 pb-4">
    Maximum of top 100 users are shown. Users must have completed 10 ranked
    matches before they get a rating.
  </p>
  <RankingTable
    v-if="rankingStats"
    :stats="rankingStats"
    label="Rating"
    :stat-format="(stat) => stat"
  />
</template>

<script setup lang="ts">
const { data: rankingStats } = await useFetch("/api/ranking/user/rating");
</script>
