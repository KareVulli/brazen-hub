<template>
  <template v-if="match">
    <PageTitle :title="`Match #${match.id}`">
      <template #actions>
        <p>Wednesday, July 1, 2026 at 6:10 AM</p>
      </template>
    </PageTitle>
    <Panel :header="match.gameRule.name" class="mb-4">
      <template #icons
        ><p>{{ duration }}</p></template
      >
      <!-- TODO -->
      <p v-if="true" class="text-green-500 font-semibold">Match in progress!</p>
      <p>New York City (Day)</p>
      <p v-if="true">
        Winner: <span class="font-semibold">{{ winnerTeam }}</span>
      </p>
    </Panel>

    <div
      v-if="teamBasedGameRules.includes(match.gameRule.name)"
      class="grid grid-cols-2 gap-4"
    >
      <div>
        <div class="text-center font-bold my-4">
          <p>Team 1</p>
          <p class="text-red-600 text-xl">{{ match.teams[0]?.wins ?? "-" }}</p>
        </div>
        <UserMatchStatsTable :team-users="match.teams[0]?.teamUsers" />
      </div>
      <div>
        <div class="text-center font-bold my-4">
          <p>Team 2</p>
          <p class="text-green-600 text-xl">
            {{ match.teams[1]?.wins ?? "-" }}
          </p>
        </div>
        <UserMatchStatsTable :team-users="match.teams[1]?.teamUsers" />
      </div>
    </div>
    <div v-else>
      <UserMatchStatsTable :team-users="allPlayers" />
    </div>
    <hr class="border-t border-slate-600 my-4" />
    <PageTitle title="Match Log" />
    <div class="space-y-2">
      <div class="flex gap-4">
        <p class="flex-shrink-0">19:31:04</p>
        <Card class="border border-slate-800 flex-grow">
          <template #content>
            <p>
              <span class="font-semibold text-blue-500">CareFully</span> died
            </p>
          </template>
        </Card>
      </div>
      <div class="flex gap-4">
        <p class="flex-shrink-0">19:30:30</p>
        <Card class="border border-slate-800 flex-grow">
          <template #content>
            <p>Round 2 started</p>
          </template>
        </Card>
      </div>
      <div class="flex gap-4">
        <p class="flex-shrink-0">19:30:22</p>
        <Card class="border border-slate-800 flex-grow">
          <template #content>
            <div class="px-2 py-0.5">
              <div class="flex justify-between items-center">
                <p class="font-semibold">Round 1 stats</p>
                <p>3 minutes 40 seconds</p>
              </div>
              <p>Winner: <span class="font-semibold">Team 2</span></p>
            </div>
            <hr class="border-t border-gray-400 mx-2 my-2" />
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="text-center font-bold my-4">
                  <p>Team 1</p>
                  <p class="text-red-600 text-xl">0</p>
                </div>
                <UserMatchStatsTable
                  :team-users="match.teams[0]?.teamUsers"
                  compact
                />
              </div>
              <div>
                <div class="text-center font-bold my-4">
                  <p>Team 2</p>
                  <p class="text-green-600 text-xl">1</p>
                </div>
                <UserMatchStatsTable
                  :team-users="match.teams[1]?.teamUsers"
                  compact
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
      <div class="flex gap-4">
        <p class="flex-shrink-0">19:27:12</p>
        <Card class="border border-slate-800 flex-grow">
          <template #content>
            <p>
              <span class="font-semibold text-red-500">Shroom</span>
              revived
              <span class="font-semibold text-red-500">Omni</span>
            </p>
          </template>
        </Card>
      </div>
      <div class="flex gap-4">
        <p class="flex-shrink-0">19:27:10</p>
        <Card class="border border-slate-800 flex-grow">
          <template #content>
            <p>
              <span class="font-semibold text-blue-500">LordDeath115</span>
              stunned
              <span class="font-semibold text-red-500">Omni</span>
            </p>
          </template>
        </Card>
      </div>
      <div class="flex gap-4">
        <p class="flex-shrink-0">19:27:00</p>
        <Card class="border border-slate-800 flex-grow">
          <template #content>
            <p>
              <span class="font-semibold text-blue-500">CareFully</span> killed
              <span class="font-semibold text-red-500">Cheeseman</span>
            </p>
          </template>
        </Card>
      </div>
      <div class="flex gap-4">
        <p class="flex-shrink-0">19:26:59</p>
        <Card class="border border-slate-800 flex-grow">
          <template #content>
            <p>
              <span class="font-semibold text-blue-500">CareFully</span> stunned
              <span class="font-semibold text-red-500">Cheeseman</span>
            </p>
          </template>
        </Card>
      </div>
      <div class="flex gap-4">
        <p class="flex-shrink-0">19:26:38</p>
        <Card class="border border-slate-800 flex-grow">
          <template #content>
            <p>Round 1 started</p>
          </template>
        </Card>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import dayjs from "#build/dayjs.imports.mjs";
import UserMatchStatsTable from "./UserMatchStatsTable.vue";
const props = defineProps<{ matchId: number }>();

const teamBasedGameRules = ["Round Team Match BO5", "Round Team Match BO3"];

const { data: match } = await useFetch(`/api/matches/${props.matchId}`);

const winnerTeam = computed(() => {
  if (!match.value) {
    return "";
  }
  const winnerTeam = [...match.value.teams].sort((a, b) => b.wins - a.wins)[0];
  if (!winnerTeam) {
    return "";
  }
  if (teamBasedGameRules.includes(match.value.gameRule.name)) {
    return `Team ${winnerTeam.team} (${winnerTeam.teamUsers.map((teamUser) => teamUser.user.name).join(", ")})`;
  } else {
    return winnerTeam.teamUsers[0]?.user.name || "";
  }
});

const allPlayers = computed(() => {
  if (!match.value) {
    return [];
  }
  return match.value.teams.reduce<TeamUserDto[]>(
    (acc, team) => [...acc, ...team.teamUsers],
    [],
  );
});

const duration = computed(() => {
  if (!match.value) {
    return 0;
  }
  return dayjs(match.value.createdAt * 1000).diff(
    dayjs(match.value.updatedAt * 1000),
  );
});
</script>
