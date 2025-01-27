<template>
  <main>
    <PageTitle title="Welcome to Brazen Hub!" />
    <div v-if="data" class="grid xl:grid-cols-2 gap-4 mb-4">
      <WeeklyChallengeOverview :weekly="data.weekly" />
      <PublicRoomsList :public-rooms="data.publicRooms" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { PublicRoomsList } from "#components";

const { data } = useFetch("/api/home");
</script>
