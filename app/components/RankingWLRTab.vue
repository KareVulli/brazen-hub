<template>
  <PageTitle title="Ranking by Average Healing Received per Round" />
  <p class="text-sm opacity-50 pb-4">
    W/L - Win-Loss Ratio. Maximum of top 100 users are shown. Excludes users
    with less that 10 matches.
  </p>
  <RankingWLRTable v-if="wlrStats" :stats="wlrStats" />
</template>

<script setup lang="ts">
const { data: wlrStats } = await useFetch("/api/ranking/user/wlr");
</script>
