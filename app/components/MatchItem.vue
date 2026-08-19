<template>
  <NuxtLink :to="`/matches/${match.id}`" class="w-full">
    <Card
      class="border hover:bg-gray-100 dark:hover:bg-gray-800 duration-100 h-full"
      :class="{
        'border-green-400': match.endedAt === null,
        'border-slate-800': match.endedAt !== null,
      }"
    >
      <template #content>
        <div class="px-2 py-0.5">
          <div class="flex justify-between items-center">
            <p class="font-semibold">
              <span
                v-if="match.endedAt === null"
                class="text-green-500 font-semibold"
                >LIVE!</span
              >
              Match #{{ match.id }} @
              <NuxtTime
                :datetime="new Date(match.createdAt * 1000)"
                date-style="full"
                time-style="short"
              />
            </p>
            <p>
              {{ matchDuration(match) }}
            </p>
          </div>
          <p>{{ match.gameRule.name }} | {{ match.stage.name }}</p>
        </div>
        <hr class="border-t border-gray-400 mx-2 my-2" />
        <div class="space-y-0.5">
          <div
            v-for="team in match.teams"
            :key="team.id"
            class="flex justify-between px-2 py-0.5"
          >
            <p class="font-semibold">
              <UserName
                v-for="(teamUser, index) in team.teamUsers"
                :key="index"
                class="mr-2"
                :user="teamUser.user"
                inline
                variant="small"
              />
            </p>
            <p
              class="font-bold"
              :class="{
                'text-green-500': isWinnerTeam(match, team.team),
                'text-red-500': !isWinnerTeam(match, team.team),
              }"
            >
              {{ team.wins }}
            </p>
          </div>
        </div>
      </template>
    </Card>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{ match: MatchDto }>();

const dayjs = useDayjs();
const formatDuration = useFormatDuration();

function isWinnerTeam(match: MatchDto, team: number) {
  const winnerTeam = [...match.teams].sort((a, b) => b.wins - a.wins)[0];
  return winnerTeam?.team === team;
}

function matchDuration(match: MatchDto) {
  if (!match) {
    return "";
  }
  if (match.endedAt === null) {
    return formatDuration(dayjs().diff(dayjs(match.createdAt * 1000)));
  }

  return formatDuration(
    dayjs(match.endedAt * 1000).diff(dayjs(match.createdAt * 1000)),
  );
}
</script>
