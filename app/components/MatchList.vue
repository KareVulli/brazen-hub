<template>
  <PageTitle title="Custom Matches" />
  <div class="border-b border-surface-200 dark:border-surface-700 mb-4 pb-4">
    <CreateWatcherForm />
  </div>
  <PageTitle title="Match history" />
  <div v-if="matches.length" class="grid gap-2 2xl:grid-cols-2">
    <MatchItem v-for="match in matches" :key="match.id" :match="match" />
  </div>
  <Card v-else>
    <template #content>
      <div class="px-2 py-0.5">
        <p class="font-semibold mb-4">No custom matches yet</p>
        <p>
          <AppLink to="steam://launch/2511050">Invite a watcher</AppLink> to
          your custom match to record custom matches.
        </p>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
defineProps<{ matches: MatchDto[] }>();
</script>
