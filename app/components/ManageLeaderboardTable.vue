<template>
  <DataTable :value="entries" sort-field="id" :sort-order="1" size="small">
    <template #empty>No scores found</template>
    <Column field="id" header="ID" sortable sort-field="id" />
    <Column
      class="min-w-24"
      field="rule.name"
      header="Rule"
      sortable
      sort-field="rule.name"
    />
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
    <Column class="min-w-28" field="attempts" header="Attempts" sortable />
    <Column class="min-w-36" field="setAt" header="Date" sortable>
      <template #body="slotProps">
        <ScoreDateColumn :date-timestamp="slotProps.data.setAt" />
      </template>
    </Column>
    <Column class="text-end">
      <template #body="{ data }">
        <Button
          size="small"
          icon="pi pi-trash"
          severity="danger"
          variant="text"
          rounded
          @click="onDelete(data.id)"
        />
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import type { CustomScore } from "~~/server/utils/score";

defineProps<{
  entries: CustomScore[];
}>();

const emit = defineEmits<{
  deleted: [];
}>();

async function onDelete(id: number) {
  await $fetch(`/api/manage/scores/${id}`, { method: "DELETE" });
  emit("deleted");
}
</script>
