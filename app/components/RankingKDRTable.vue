<template>
  <DataTable :value="data" sort-field="place" :sort-order="1">
    <template #empty>No stats found</template>
    <Column class="w-24" field="rank" header="Rank" sortable />
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
    <Column class="min-w-28" field="kdr" header="KDR" sortable>
      <template #body="slotProps">
        {{ slotProps.data.kdr.toFixed(2) }}
      </template>
    </Column>
    <Column field="kills" header="Kills" sortable />
    <Column field="deaths" header="Deaths" sortable />
    <Column field="matches" header="Matches" sortable />
  </DataTable>
</template>

<script setup lang="ts">
import type { UserKDRStat } from "~~/server/utils/ranking";

const props = defineProps<{
  stats: UserKDRStat[];
}>();

const data = computed(() => {
  return props.stats.map((item, index) => ({
    rank: index + 1,
    ...item,
  }));
});
</script>
