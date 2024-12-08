<template>
  <DataTable :value="entries">
    <Column field="place" header="Place" />
    <Column field="username" header="Username">
      <template #body="slotProps">
        {{ slotProps.data.user.name }}
      </template>
    </Column>
    <Column field="time" header="Time">
      <template #body="slotProps">
        {{
          $dayjs
            .duration(slotProps.data.time, "milliseconds")
            .format("mm:ss.SSS")
        }}
      </template>
    </Column>
    <Column field="score" header="Score" />
    <Column field="attempts" header="Attempts (inaccurate)" />
  </DataTable>
</template>

<script setup lang="ts">
import type { LeaderboardEntry } from "~~/server/utils/eventInfo";

defineProps<{
  entries: LeaderboardEntry[];
}>();
</script>
