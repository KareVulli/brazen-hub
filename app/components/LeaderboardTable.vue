<template>
  <DataTable :value="entries" sort-field="place" :sort-order="1">
    <template #empty>No scores found</template>
    <Column field="place" header="Place" sortable />
    <Column field="user" header="User" sortable sort-field="user.name">
      <template #body="slotProps">
        <UserName :user="slotProps.data.user" />
      </template>
    </Column>
    <Column field="time" header="Time" sortable>
      <template #body="slotProps">
        {{
          $dayjs
            .duration(slotProps.data.time, "milliseconds")
            .format("mm:ss.SSS")
        }}
      </template>
    </Column>
    <Column field="score" header="Score" sortable />
    <Column field="attempts" header="Attempts" sortable />
  </DataTable>
</template>

<script setup lang="ts">
import type { LeaderboardEntry } from "~~/server/utils/eventInfo";

defineProps<{
  entries: LeaderboardEntry[];
}>();
</script>
