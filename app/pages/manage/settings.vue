<template>
  <main>
    <PageTitle title="Manage Brazen Hub Configuration" />
    <SettingsForm v-if="data" :settings="data" />
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth-admin"],
  layout: "management",
});

useHead({
  title: "Settings",
});

const { data } = useFetch("/api/manage/settings", { key: "manage-settings" });
</script>
