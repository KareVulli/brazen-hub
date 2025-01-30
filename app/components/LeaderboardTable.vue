<template>
  <DataTable :value="entries" sort-field="place" :sort-order="1">
    <template #empty>No scores found</template>
    <Column class="min-w-24" field="place" header="Place" sortable />
    <Column
      class="min-w-48"
      field="user"
      header="User"
      sortable
      sort-field="user.name"
    >
      <template #body="slotProps">
        <LinkedUserName :user="slotProps.data.user" />
      </template>
    </Column>
    <Column
      class="min-w-32"
      field="character"
      header="Character"
      sortable
      sort-field="character.name"
    >
      <template #body="slotProps">
        <CharacterName
          v-if="slotProps.data.character"
          :character="slotProps.data.character"
        />
        <i v-else class="opacity-50">Unknown</i>
      </template>
    </Column>
    <Column
      class="min-w-40"
      field="subWeapon"
      header="Sub-Weapon"
      sortable
      sort-field="subWeapon.name"
    >
      <template #body="slotProps">
        <span v-if="slotProps.data.subWeapon">{{
          slotProps.data.subWeapon.name
        }}</span>
        <i v-else class="opacity-50">Unknown</i>
      </template>
    </Column>
    <Column class="min-w-28" field="time" header="Time" sortable>
      <template #body="slotProps">
        {{
          $dayjs
            .duration(slotProps.data.time, "milliseconds")
            .format("mm:ss.SSS")
        }}
      </template>
    </Column>
    <Column class="min-w-28" field="score" header="Score" sortable />
    <Column class="min-w-28" field="attempts" header="Attempts" sortable />
    <Column class="min-w-36" field="setAt" header="Date" sortable>
      <template #body="slotProps">
        <NuxtTime
          v-if="slotProps.data.setAt"
          :datetime="new Date(slotProps.data.setAt * 1000)"
          relative
        />
        <i v-else class="opacity-50">Unknown</i>
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import type { LeaderboardEntry } from "~~/server/utils/eventInfo";

defineProps<{
  entries: LeaderboardEntry[];
}>();
</script>
