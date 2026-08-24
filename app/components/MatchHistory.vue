<template>
  <PageTitle title="Custom Matches" />
  <CreateWatcher />
  <hr class="my-4 border-surface-200 dark:border-surface-700" />
  <PageTitle title="Match history">
    <template #actions>
      <Button
        label="Refresh"
        icon="pi pi-refresh"
        size="small"
        severity="secondary"
        @click="reset"
      />
    </template>
  </PageTitle>
  <MatchList />
</template>

<script setup lang="ts">
import { useQueryClient } from "@tanstack/vue-query";
const queryClient = useQueryClient();

async function reset() {
  queryClient.resetQueries(
    { queryKey: ["infiniteMatches"] },
    { cancelRefetch: false },
  );
}
</script>
