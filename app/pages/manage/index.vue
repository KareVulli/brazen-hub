<template>
  <main>
    <PageTitle title="Manage custom scores" />
    <ManageLeaderboardTable v-if="data" :entries="data.scores" />
    <CreateScoreForm @created="onCreated" />
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth-admin"],
});

const { data, refresh } = await useFetch("/api/manage/scores");

function onCreated() {
  refresh();
}
</script>
