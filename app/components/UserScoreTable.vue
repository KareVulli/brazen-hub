<template>
  <DataTable :value="scores" sort-field="rule.name" :sort-order="1">
    <template #empty>No scores found</template>
    <Column field="rule.name" header="Rule" class="text-nowrap" sortable />
    <Column
      field="rule.stageName"
      header="Stage"
      class="text-nowrap"
      sortable
    />
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
    <Column field="time" header="Time" sortable>
      <template #body="slotProps">
        <ScoreTimeColumn :time-ms="slotProps.data.time" />
      </template>
    </Column>
    <Column field="score" header="Score" sortable />
    <Column class="min-w-36" field="setAt" header="Date" sortable>
      <template #body="slotProps">
        <ScoreDateColumn :date-timestamp="slotProps.data.setAt" />
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import type { BaseScore } from "~~/server/utils/score";

defineProps<{
  scores: BaseScore[];
}>();
</script>
