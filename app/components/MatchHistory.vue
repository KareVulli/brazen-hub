<template>
  <PageTitle title="Custom Matches" />
  <CreateWatcher />
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
