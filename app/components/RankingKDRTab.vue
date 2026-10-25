<template>
  <PageTitle title="Ranking by Kill-Death Ratio" />
  <p class="text-sm opacity-50 pb-4">
    KDR - Kill-Death Ratio. Maximum of top 100 users are shown. Excludes users
    with less that 10 matches.
  </p>
  <RankingKDRTable v-if="kdrStats" :stats="kdrStats" />
</template>

<script setup lang="ts">
const { data: kdrStats } = await useFetch("/api/ranking/user/kdr");
</script>
