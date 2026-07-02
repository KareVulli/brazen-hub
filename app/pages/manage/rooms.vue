<template>
  <main>
    <PageTitle title="Manage Rooms" />
    <ManageRoomsTable
      v-if="data"
      :entries="data.rooms"
      @opened="refresh"
      @closed="refresh"
    />
    <CreateRoomForm @created="refresh" />
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth-admin"],
  layout: "management",
});

const config = useRuntimeConfig();

const { data: _wsdata } = useWebSocket(config.public.matchmakingWs, {
  onConnected(ws) {
    console.log("Connected!");
    ws.send("Hello from client!");
  },
  onDisconnected(ws, event) {
    console.log("Disconnected!", event.code);
  },
  onError(ws, event) {
    console.error("Error:", event);
  },
  onMessage(ws, event) {
    console.log("Message:", event.data);
  },
});

const { data, refresh } = await useFetch("/api/manage/rooms");
</script>
