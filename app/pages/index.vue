<template>
  <main>
    <PageTitle title="Welcome to Brazen Hub!" />
    <div
      v-if="data"
      class="grid lg:grid-cols-2 grid-flow-dense gap-4 mb-4 items-start"
    >
      <MatchesOverview :matches="data.matches" />
      <div class="space-y-4">
        <PublicRoomsList :public-rooms="data.publicRooms" />
        <WeeklyChallengeOverview :weekly="data.weekly" />
        <ChangeLog />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { PublicRoomsList, MatchesOverview } from "#components";

const { data } = useFetch("/api/home");
</script>
