<template>
  <NuxtLink :to="`/matches/${match.id}`" class="w-full min-w-0">
    <Card
      class="border border-surface-200 dark:border-surface-700 hover:bg-gray-100 dark:hover:bg-gray-800 duration-100 h-full"
      :class="{
        'border-green-400': match.endedAt === null,
        'border-slate-800': match.endedAt !== null,
      }"
    >
      <template #content>
        <div class="flex justify-between lg:items-center flex-col lg:flex-row">
          <p class="font-semibold">
            <span
              v-if="match.endedAt === null"
              class="text-green-500 font-semibold"
              >LIVE!</span
            >
            Match #{{ match.id }}
          </p>
          <p>
            <NuxtTime
              :datetime="new Date(match.createdAt * 1000)"
              date-style="medium"
              time-style="short"
            />
            (<NuxtTime :datetime="new Date(match.createdAt * 1000)" relative />)
          </p>
        </div>
        <p>{{ match.gameRule.name }} | {{ match.stage.name }}</p>
        <hr class="border-t border-surface-200 dark:border-surface-700 my-2" />
        <MatchItemPlayers :match="match" />
      </template>
    </Card>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{ match: MatchDto }>();
</script>
