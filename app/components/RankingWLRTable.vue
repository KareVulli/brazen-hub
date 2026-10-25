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
    <Column class="min-w-28" field="wlr" header="W/L" sortable>
      <template #body="slotProps">
        {{ slotProps.data.wlr.toFixed(1) }}%
      </template>
    </Column>
    <Column field="wins" header="Wins" sortable />
    <Column field="losses" header="Losses" sortable />
    <Column field="matches" header="Matches" sortable />
  </DataTable>
</template>

<script setup lang="ts">
import type { UserWLRStat } from "~~/server/utils/ranking";

const props = defineProps<{
  stats: UserWLRStat[];
}>();

const data = computed(() => {
  return props.stats.map((item, index) => ({
    rank: index + 1,
    ...item,
  }));
});
</script>
