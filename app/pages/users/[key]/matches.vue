<template>
  <div>
    <PageTitle v-if="user" :title="`User ${user.name} matches`">
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
    <MatchList :user-key="userKey" />
  </div>
</template>

<script setup lang="ts">
import { useQueryClient } from "@tanstack/vue-query";
const queryClient = useQueryClient();

const route = useRoute();

const userKey = computed(() => route.params.key as string);

const { data } = await useFetch("/api/search-user", {
  query: { query: userKey },
});

const user = computed(() => {
  if (data.value && "user" in data.value) {
    return data.value.user;
  }
  return null;
});

async function reset() {
  queryClient.resetQueries(
    { queryKey: ["infiniteMatches"] },
    { cancelRefetch: false },
  );
}
</script>
