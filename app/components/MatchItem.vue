<template>
  <NuxtLink :to="`/matches/${match.id}`" class="w-full min-w-0">
    <Card
      v-tooltip.bottom="
        match.errored
          ? {
              value:
                'StatsBot had issues during this match. The data may be incomplete.',
              pt: {
                text: 'text-sm',
                root: '!max-w-md',
              },
            }
          : undefined
      "
      class="border hover:bg-gray-100 dark:hover:bg-gray-800 duration-100 h-full"
      :class="{
        'border-green-400': match.endedAt === null,
        'border-surface-200 dark:border-surface-700': match.endedAt !== null,
        'opacity-50': match.errored,
      }"
      :pt="{
        body: {
          class:
            highlightPlayer && match.endedAt !== null ? 'pl-0 h-full' : null,
        },
        content: {
          class: 'h-full',
        },
      }"
    >
      <template #content>
        <div class="flex w-full h-full items-center">
          <div
            v-if="highlightPlayer && !!match.endedAt"
            class="w-1 mr-4 h-16 rounded-sm shrink-0"
            :class="{
              'bg-green-500 dark:bg-green-600':
                isHighlightPlayerWinner === true,
              'bg-red-500 dark:bg-red-600': isHighlightPlayerWinner === false,
            }"
          />
          <div class="grow h-full">
            <div
              class="flex justify-between lg:items-center flex-col lg:flex-row"
            >
              <p class="font-semibold">
                <span
                  v-if="match.endedAt === null"
                  class="text-green-500 font-semibold"
                >
                  LIVE!
                </span>
                <span
                  v-if="match.errored"
                  class="pi pi-times-circle text-gray-500"
                />
                Match #{{ match.id }}
              </p>
              <p>
                <NuxtTime
                  :datetime="new Date(match.createdAt * 1000)"
                  date-style="medium"
                  time-style="short"
                />
                (<NuxtTime
                  :datetime="new Date(match.createdAt * 1000)"
                  relative
                />)
              </p>
            </div>
            <p>{{ match.gameRule.name }} | {{ match.stage.name }}</p>
            <hr
              class="border-t border-surface-200 dark:border-surface-700 my-2"
            />
            <MatchItemPlayers
              :match="match"
              :highlight-player="highlightPlayer"
            />
          </div>
        </div>
      </template>
    </Card>
  </NuxtLink>
</template>

<script setup lang="ts">
import { getWinnerTeam } from "~/util/getWinnerTeam";
const props = defineProps<{ match: MatchDto; highlightPlayer?: string }>();

const isHighlightPlayerWinner = computed<boolean | null>(() => {
  if (!props.highlightPlayer) {
    return null;
  }
  const winnerTeam = getWinnerTeam(props.match);
  if (!winnerTeam) {
    return null;
  }
  return !!winnerTeam.teamUsers.find(
    (teamUser) => teamUser.user.userKey === props.highlightPlayer,
  );
});
</script>
