<template>
  <PageTitle title="Ranking by Average Damage per Round" />
  <p class="text-sm opacity-50 pb-4">
    ADR - Average Damage per Round. Maximum of top 100 users are shown. Excludes
    users with less that 10 matches.
  </p>
  <RankingTable
    v-if="adrStats"
    :stats="adrStats"
    label="ADR"
    :stat-format="(stat) => Math.round(stat)"
  />
</template>

<script setup lang="ts">
const { data: adrStats } = await useFetch("/api/ranking/user/adr");
</script>
