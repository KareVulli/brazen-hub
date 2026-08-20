<template>
  <PageTitle title="Custom Matches" />

  <AuthState v-slot="{ loggedIn }">
    <div
      v-if="loggedIn"
      class="border-b border-surface-200 dark:border-surface-700 mb-4 pb-4"
    >
      <CreateWatcherForm />
    </div>
    <Message v-else class="mb-4"
      ><a href="/auth/discord" class="hover:underline font-semibold">Log in</a>
      to add a watcher to your custom room</Message
    >
  </AuthState>
  <PageTitle title="Match history">
    <template #actions>
      <Button
        label="Refresh"
        icon="pi pi-refresh"
        size="small"
        severity="secondary"
        :disabled="isFetching"
        @click="reset"
      />
    </template>
  </PageTitle>
  <template v-if="isFetching || matches.length">
    <div class="grid gap-2 2xl:grid-cols-2">
      <MatchItem v-for="match in matches" :key="match.id" :match="match" />
    </div>
    <div class="text-center my-4">
      <ProgressSpinner
        v-if="isFetching"
        style="width: 32px; height: 32px"
        stroke-width="8"
      />
    </div>
  </template>
  <template v-else>
    <p class="font-semibold mb-4">No custom matches yet</p>
    <p>
      Invite a watcher to record your custom matches by entering the room code
      to the form above.
    </p>
  </template>
</template>

<script setup lang="ts">
import { useQueryClient } from "@tanstack/vue-query";

const { data, isFetching, fetchNextPage, hasNextPage, refetch } =
  await useInfiniteMatches();
const queryClient = useQueryClient();

const el = ref<Document | null>(null);

const matches = computed(() => {
  return (
    data.value?.pages.reduce<MatchDto[]>(
      (acc, page) => [...acc, ...page.results],
      [],
    ) || []
  );
});

function reset() {
  queryClient.removeQueries({ queryKey: ["infiniteMatches"] });
  refetch();
}

useInfiniteScroll(
  el,
  () => {
    fetchNextPage();
  },
  {
    distance: 100,
    canLoadMore: () => {
      return !isFetching.value && hasNextPage.value;
    },
  },
);

onMounted(() => {
  el.value = document;
});
onUnmounted(() => {
  queryClient.removeQueries({ queryKey: ["infiniteMatches"] });
});
</script>
