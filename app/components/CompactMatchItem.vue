<template>
  <NuxtLink :to="`/matches/${match.id}`" class="group w-full flex">
    <div
      v-if="highlightPlayer && !!match.endedAt"
      class="w-1 my-1 mr-4 rounded-sm shrink-0"
      :class="{
        'bg-green-500 dark:bg-green-600': isHighlightPlayerWinner === true,
        'bg-red-500 dark:bg-red-600': isHighlightPlayerWinner === false,
      }"
    />
    <div class="grow">
      <div class="flex justify-between items-center mb-2">
        <p class="font-semibold group-hover:underline truncate">
          <Tag
            v-if="match.endedAt === null"
            value="Live!"
            severity="active"
            class="mr-2"
          />{{ match.gameRule.name }} | {{ match.stage.name }}
        </p>
        <NuxtTime
          class="whitespace-nowrap"
          :datetime="new Date(match.createdAt * 1000)"
          date-style="full"
          time-style="short"
          relative
        />
      </div>
      <MatchItemPlayers :match="match" :highlight-player="highlightPlayer" />
    </div>
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
