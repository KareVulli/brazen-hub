<template>
  <DataTable :value="entries">
    <Column field="place" header="Place" />
    <Column field="user" header="User">
      <template #body="slotProps">
        <div class="flex items-center gap-2 relative">
          <img
            class="h-8 flex-shrink-0"
            :src="`https://static.prod.brazenblaze.com/public-assets/profile-icon/thumbnail/${slotProps.data.user.iconId}.png`"
          />
          <img
            class="h-8 absolute left-0 top-0"
            :src="`https://static.prod.brazenblaze.com/public-assets/profile-icon-frame/thumbnail/${slotProps.data.user.iconFrameId}.png`"
          />
          {{ slotProps.data.user.name }}
        </div>
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
