<template>
  <div
    v-if="teamBasedGameRuleTypes.includes(gameRule.gameRuleType)"
    class="grid 2xl:grid-cols-2 gap-2"
  >
    <div>
      <div class="text-center font-bold my-4">
        <p>{{ getTeamName(teams[0]) }}</p>
        <p
          class="text-xl"
          :class="winningTeam === teams[0] ? 'text-green-600' : 'text-red-600'"
        >
          {{ teams[0]?.wins ?? "-" }}
        </p>
      </div>
      <UserMatchStatsTable
        :team-users="teams[0]?.teamUsers"
        initial-sort="name"
        :compact="compact"
      />
    </div>
    <div>
      <div class="text-center font-bold my-4">
        <p>{{ getTeamName(teams[1]) }}</p>
        <p
          class="text-xl"
          :class="winningTeam === teams[1] ? 'text-green-600' : 'text-red-600'"
        >
          {{ teams[1]?.wins ?? "-" }}
        </p>
      </div>
      <UserMatchStatsTable
        :team-users="teams[1]?.teamUsers"
        initial-sort="name"
        :compact="compact"
      />
    </div>
  </div>
  <div v-else-if="gameRule.gameRuleType === 'Survival'">
    <UserMatchStatsTable
      :team-users="allPlayers"
      initial-sort="placement"
      :compact="compact"
      show-placement
    />
  </div>
  <div v-else>
    <UserMatchStatsTable
      :team-users="allPlayers"
      initial-sort="kills"
      :compact="compact"
    />
  </div>
</template>

<script setup lang="ts">
import type { GameRuleDto } from "~~/server/utils/gameRule";
import type { TeamDto } from "~~/server/utils/team";

const props = defineProps<{
  gameRule: GameRuleDto;
  teams: TeamDto[];
  compact?: boolean;
}>();

const teamBasedGameRuleTypes = ["RoundMatch", "StockMatch", "Duel"];

const allPlayers = computed(() => {
  return props.teams.reduce<(TeamUserDto & { team: TeamDto })[]>(
    (acc, team) => [
      ...acc,
      ...team.teamUsers.map((teamUser) => ({
        ...teamUser,
        team: team,
      })),
    ],
    [],
  );
});

const winningTeam = computed(() => {
  return [...props.teams].sort((a, b) => b.wins - a.wins)[0];
});

function getTeamName(team?: TeamDto) {
  if (!team) {
    return "";
  }
  if (team.teamUsers.length === 1 && team.teamUsers[0]?.user.name) {
    return team.teamUsers[0].user.name;
  } else {
    return `Team ${team.team}`;
  }
}
</script>
