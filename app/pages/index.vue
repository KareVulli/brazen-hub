<template>
  <main>
    <PageTitle title="Welcome to Brazen Hub!" />
    <div
      v-if="data"
      class="grid lg:grid-cols-2 grid-flow-dense gap-4 mb-4 items-start"
    >
      <div class="space-y-4">
        <Panel
          header="Record matches"
          :pt="{ contentWrapper: { class: 'min-w-0' } }"
        >
          <CreateWatcher />
        </Panel>
        <MatchesOverview :matches="data.matches" />
      </div>
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
