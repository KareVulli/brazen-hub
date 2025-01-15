<template>
  <DataTable :value="scores">
    <template #empty>No scores found</template>
    <Column field="name" header="Rule" />
    <Column field="stageName" header="Stage" />
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
  </DataTable>
</template>

<script setup lang="ts">
import type { TopScore } from "~~/server/api/search-user.get";

defineProps<{
  scores: TopScore[];
}>();
</script>
