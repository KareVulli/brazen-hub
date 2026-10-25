<template>
  <PageTitle title="Ranking by Average Kills per Round" />
  <p class="text-sm opacity-50 pb-4">
    AKR - Average Kills per Round. Maximum of top 100 users are shown. Excludes
    users with less that 10 matches.
  </p>
  <RankingTable
    v-if="akrStats"
    :stats="akrStats"
    label="AKR"
    :stat-format="(stat) => stat.toFixed(2)"
  />
</template>

<script setup lang="ts">
const { data: akrStats } = await useFetch("/api/ranking/user/akr");
</script>
