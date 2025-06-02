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
        <ScoreTimeColumn :time-ms="slotProps.data.time" />
      </template>
    </Column>
    <Column class="min-w-28" field="score" header="Score" sortable />
    <Column
      v-if="attempts"
      class="min-w-28"
      field="attempts"
      header="Attempts"
      sortable
    >
      <template #body="slotProps">
        <span v-if="slotProps.data.attempts !== null">{{
          slotProps.data.attempts
        }}</span>
        <i v-else class="opacity-50">Unknown</i>
      </template>
    </Column>
    <Column class="min-w-36" field="setAt" header="Date" sortable>
      <template #body="slotProps">
        <ScoreDateColumn :date-timestamp="slotProps.data.setAt" />
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import type { Score } from "~~/server/utils/score";

const { attempts = true } = defineProps<{
  entries: Score[];
  attempts?: boolean;
}>();
</script>
