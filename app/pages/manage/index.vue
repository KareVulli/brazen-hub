<template>
  <main>
    <PageTitle title="Manage custom scores" />
    <ManageLeaderboardTable v-if="data" :entries="data.scores" />
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth-admin"],
});

const { data } = await useFetch("/api/manage/scores");
</script>
