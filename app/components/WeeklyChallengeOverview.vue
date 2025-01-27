<template>
  <Panel header="Current weekly challenge">
    <template #icons>
      <AppLink
        v-if="weekly"
        class="text-sm"
        :to="{ path: `/weekly-challenges/${weekly.eventId}` }"
        >Go to leaderboard</AppLink
      >
    </template>
    <template v-if="weekly">
      <p v-if="weekly.rule" class="capitalize">
        {{ weekly.rule.name.toLowerCase() }}
      </p>
      <p v-if="weekly.rule">{{ weekly.rule.stageName }}</p>
      <p>
        Runner:
        <CharacterName v-if="weekly.character" :character="weekly.character" />
        <template v-else>Any</template>
      </p>
      <p>
        Sub-Weapon:
        {{ weekly.subWeapon?.name || "Any" }}
      </p>
      <p>
        <NuxtTime
          :datetime="
            $dayjs(weekly.endsAt * 1000)
              .subtract(7, 'days')
              .toDate()
          "
          date-style="medium"
          time-style="short"
        />
        -
        <NuxtTime
          :datetime="new Date(weekly.endsAt * 1000)"
          date-style="medium"
          time-style="short"
        />
        -
        <span class="text-green-500 font-bold"
          >Ends <NuxtTime :datetime="new Date(weekly.endsAt * 1000)" relative
        /></span>
      </p>
    </template>
    <template v-else>No active weekly challenge</template>
  </Panel>
</template>

<script setup lang="ts">
defineProps<{
  weekly: EventInfo | null;
}>();
</script>
