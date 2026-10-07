<template>
  <div
    v-if="TEAM_BASED_GAMERULE_TYPES.includes(match.gameRule.gameRuleType)"
    class="space-y-0.5"
  >
    <div v-for="team in match.teams" :key="team.id" class="flex">
      <UserName
        v-for="(teamUser, index) in team.teamUsers"
        :key="index"
        class="mr-2"
        :class="{
          'font-semibold': teamUser.user.userKey === highlightPlayer,
        }"
        :user="teamUser.user"
        variant="small"
      />
      <p
        class="font-bold ml-auto"
        :class="{
          'text-green-500': isWinnerTeam(match, team.team),
          'text-red-500': !isWinnerTeam(match, team.team),
        }"
      >
        {{ team.wins }}
      </p>
    </div>
  </div>
  <div
    v-else-if="match.gameRule.gameRuleType === 'Survival'"
    class="grid grid-cols-3 gap-x-2"
  >
    <div
      v-for="(team, index) in match.teams"
      :key="index"
      class="flex justify-between"
    >
      <UserName
        v-if="team.teamUsers[0]"
        class="mr-2"
        :class="{
          'font-semibold': team.teamUsers[0].user.userKey === highlightPlayer,
        }"
        :user="team.teamUsers[0].user"
        variant="small"
      />
      <p
        class="font-bold"
        :class="rankClass[team.placement - 1] || 'opacity-20'"
      >
        #{{ team.placement > 0 ? team.placement : "-" }}
      </p>
    </div>
  </div>
  <div v-else class="grid grid-cols-3 gap-x-2">
    <div
      v-for="(player, index) in playersByKills"
      :key="index"
      class="flex justify-between"
    >
      <UserName
        class="mr-2"
        :class="{
          'font-semibold': player.user.userKey === highlightPlayer,
        }"
        :user="player.user"
        variant="small"
      />
      <p class="font-bold" :class="rankClass[index] || 'opacity-20'">
        {{ player.kills }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TEAM_BASED_GAMERULE_TYPES } from "~~/shared/constants";
import { getWinnerTeam } from "~/util/getWinnerTeam";

const props = defineProps<{ match: MatchDto; highlightPlayer?: string }>();

function isWinnerTeam(match: MatchDto, team: number) {
  const winnerTeam = getWinnerTeam(match);
  return winnerTeam?.team === team;
}

const playersByKills = computed(() => {
  return props.match.teams
    .reduce<TeamUserDto[]>(
      (acc, team) => [
        ...acc,
        ...team.teamUsers.map((teamUser) => ({
          ...teamUser,
          placement: team.placement,
        })),
      ],
      [],
    )
    .sort((a, b) => b.kills - a.kills);
});

const rankClass = [
  "text-green-500",
  "text-lime-500",
  "text-yellow-500",
  "text-amber-500",
  "text-orange-500 ",
  "text-red-500",
];
</script>
