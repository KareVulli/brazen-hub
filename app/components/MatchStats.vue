<template>
  <div class="flex items-center justify-end gap-2 my-2">
    <FormFieldLabel
      class="cursor-pointer"
      :name="switchId"
      label="Show more stats"
    />
    <InputSwitch v-model="showDetails" :input-id="switchId" />
  </div>
  <div
    v-if="teamBasedGameRuleTypes.includes(gameRule.gameRuleType)"
    class="grid gap-2"
  >
    <div class="min-w-0">
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
        :show-details="showDetails"
      />
    </div>
    <div class="min-w-0">
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
        :show-details="showDetails"
      />
    </div>
  </div>
  <div v-else-if="gameRule.gameRuleType === 'Survival'" class="min-w-0">
    <UserMatchStatsTable
      :team-users="allPlayers"
      initial-sort="placement"
      :compact="compact"
      :show-details="showDetails"
      show-placement
    />
  </div>
  <div v-else class="min-w-0">
    <UserMatchStatsTable
      :team-users="allPlayers"
      initial-sort="kills"
      :compact="compact"
      :show-details="showDetails"
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

const switchId = useId();
const showDetails = ref<boolean>(false);
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
