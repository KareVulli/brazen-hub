<template>
  <main>
    <PageTitle title="Welcome to Brazen Hub!" />
    <div v-if="data" class="grid lg:grid-cols-2 grid-flow-dense gap-4 mb-4">
      <WeeklyChallengeOverview :weekly="data.weekly" />
      <PublicRoomsList :public-rooms="data.publicRooms" />
      <Panel class="lg:col-span-2">
        <div class="font-semibold text-center pb-5">
          More to be added soon!™
        </div>
      </Panel>
    </div>
  </main>
</template>

<script setup lang="ts">
import { PublicRoomsList } from "#components";

const { data } = useFetch("/api/home");
</script>
