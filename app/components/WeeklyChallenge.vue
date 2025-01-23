<template>
  <div v-if="eventInfo?.event">
    <div class="grid xl:grid-cols-2">
      <PageTitle :title="`Weekly Challenge - ${eventName ? eventName : ''}`" />
      <p class="mb-4 xl:text-right">
        <template v-if="eventInfo.event.endsAt * 1000 > Date.now()">
          Last updated:
          <NuxtTime
            :datetime="new Date(eventInfo.event.updatedAt)"
            date-style="full"
            time-style="short"
          />.
        </template>
      </p>
    </div>
    <div class="grid xl:grid-cols-2 gap-4 mb-4">
      <Panel header="Event period">
        <p>
          Started at:
          <NuxtTime
            :datetime="
              $dayjs(eventInfo.event.endsAt * 1000)
                .subtract(7, 'days')
                .toDate()
            "
            date-style="full"
            time-style="short"
          />
        </p>
        <p>
          <template v-if="eventInfo.event.endsAt * 1000 > Date.now()"
            >Ends at: </template
          ><template v-else>Ended at: </template>
          <NuxtTime
            :datetime="new Date(eventInfo.event.endsAt * 1000)"
            date-style="full"
            time-style="short"
          />
        </p>
        <p
          v-if="eventInfo.event.endsAt * 1000 > Date.now()"
          class="text-green-500 font-bold"
        >
          Currently live! Ends
          <NuxtTime
            :datetime="new Date(eventInfo.event.endsAt * 1000)"
            relative
          />.
        </p>
      </Panel>
      <Panel v-if="eventInfo.event.rule" header="Ruleset">
        <p v-if="eventInfo.event.rule" class="capitalize">
          {{ eventInfo.event.rule.name.toLowerCase() }}
        </p>
        <p>{{ eventInfo.event.rule.stageName }}</p>
        <p>
          Runner:
          <CharacterName
            v-if="eventInfo.event.character"
            :character="eventInfo.event.character"
          />
          <template v-else>Any</template>
        </p>
        <p>
          Sub-Weapon:
          {{ eventInfo.event.subWeapon?.name || "Any" }}
        </p>
      </Panel>
    </div>
    <WeeklyChallengeChart
      v-if="showChart"
      :event-id="eventInfo.event.eventId"
    />
    <p class="my-4">Leaderboard:</p>

    <LeaderboardTable :entries="eventInfo.event.leaderboard" />
    <template v-if="eventInfo.event.worldRecord !== null">
      <h3 class="my-4">All time world record:</h3>
      <LeaderboardTable :entries="[eventInfo.event.worldRecord]" />
    </template>
  </div>
  <div v-else>
    <p class="my-4">No event currently active.</p>
  </div>
</template>

<script setup lang="ts">
import WeeklyChallengeChart from "./WeeklyChallengeChart.vue";

const props = defineProps<{
  eventId?: string;
  eventName?: string;
  showChart: boolean;
}>();
const { data: eventInfo } = await useFetch(
  props?.eventId ? `/api/weekly/${props.eventId}` : "/api/weekly"
);
</script>
