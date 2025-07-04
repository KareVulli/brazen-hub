<template>
  <main>
    <PageTitle title="Manage Rooms" />
    <ManageRoomsTable v-if="data" :entries="data.rooms" @deleted="refresh" />
    <CreateRoomForm @created="refresh" />
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth-admin"],
  layout: "management",
});

const { data, refresh } = await useFetch("/api/manage/rooms");
</script>
