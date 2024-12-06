<template>
  <DataTable :value="entries">
    <Column field="place" header="Place" />
    <Column field="username" header="Username" />
    <Column field="time" header="Time">
      <template #body="slotProps">
        {{
          $dayjs
            .duration(slotProps.data.time, "milliseconds")
            .format("mm:ss.sss")
        }}
      </template>
    </Column>
    <Column field="score" header="Score" />
    <Column field="attempts" header="Attempts" />
  </DataTable>
</template>

<script setup lang="ts">
import type { LeaderboardEntry } from "~~/server/api/weekly/index.get";

defineProps<{
  entries: LeaderboardEntry[];
}>();
</script>
