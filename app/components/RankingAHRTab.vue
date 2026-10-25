<template>
  <PageTitle title="Ranking by Average Healing Received per Round" />
  <p class="text-sm opacity-50 pb-4">
    AHR - Average Healing received per Round. Maximum of top 100 users are
    shown. Excludes users with less that 10 matches.
  </p>
  <RankingAHRTable v-if="ahrStats" :stats="ahrStats" />
</template>

<script setup lang="ts">
const { data: ahrStats } = await useFetch("/api/ranking/user/ahr");
</script>
