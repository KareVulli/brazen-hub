<template>
  <NuxtLink :to="`/matches/${match.id}`" class="w-full group duration-100">
    <div class="flex justify-between items-center mb-2">
      <p class="font-semibold group-hover:underline">
        <Tag
          v-if="match.endedAt === null"
          value="Live!"
          severity="active"
          class="mr-2"
        />{{ match.gameRule.name }} | {{ match.stage.name }}
      </p>
      <NuxtTime
        :datetime="new Date(match.createdAt * 1000)"
        date-style="full"
        time-style="short"
        relative
      />
    </div>
    <div class="">
      <div
        v-for="team in match.teams"
        :key="team.id"
        class="flex justify-between"
      >
        <p>
          <template v-for="(teamUser, index) in team.teamUsers" :key="index">
            <UserName
              class="mr-2"
              :user="teamUser.user"
              inline
              variant="small"
            />
          </template>
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
