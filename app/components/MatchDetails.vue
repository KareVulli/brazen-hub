<template>
  <PageTitle title="Match #421">
    <template #actions>
      <p>Wednesday, July 1, 2026 at 6:10 AM</p>
    </template>
  </PageTitle>
  <Panel :header="match.gameRule.name">
    <template #icons><p>2 minutes 10 seconds</p></template>
    <p v-if="!match?.ended" class="text-green-500 font-semibold">
      Match in progress!
    </p>
    <p>New York City (Day)</p>

    <p v-if="match?.ended">
      Winner: <span>{{ winnerTeam }}</span>
    </p>
  </Panel>

  <div
    v-if="match.gameRule.name === 'Round Team Match BO5'"
    class="grid grid-cols-2 gap-4"
  >
    <div>
      <div class="text-center font-bold my-4">
        <p>Team 1</p>
        <p class="text-red-600 text-xl">0</p>
      </div>
      <DataTable :value="match.teams[0]?.players" size="small">
        <Column field="name" header="Name"/>
        <Column field="runner" header="Runner"/>
        <Column field="kills" header="Kills"/>
        <Column field="deaths" header="Deaths"/>
        <Column field="stuns" header="Stuns"/>
        <Column field="damage" header="Damage"/>
      </DataTable>
    </div>
    <div>
      <div class="text-center font-bold my-4">
        <p>Team 2</p>
        <p class="text-green-600 text-xl">1</p>
      </div>
      <DataTable :value="match.teams[1]?.players" size="small">
        <Column field="name" header="Name"/>
        <Column field="runner" header="Runner"/>
        <Column field="kills" header="Kills"/>
        <Column field="deaths" header="Deaths"/>
        <Column field="stuns" header="Stuns"/>
        <Column field="damage" header="Damage"/>
      </DataTable>
    </div>
  </div>
  <div v-else>
    <DataTable :value="allPlayers" size="small">
      <Column field="name" header="Name"/>
      <Column field="runner" header="Runner"/>
      <Column field="kills" header="Kills"/>
      <Column field="deaths" header="Deaths"/>
      <Column field="stuns" header="Stuns"/>
      <Column field="damage" header="Damage"/>
    </DataTable>
  </div>
  <hr class="border-t border-slate-600 my-4" >
  <PageTitle title="Match Log" />
  <div class="space-y-2">
    <div class="flex gap-4">
      <p class="flex-shrink-0">19:31:04</p>
      <Card class="border border-gray-500 flex-grow">
        <template #content>
          <p><span class="font-semibold text-blue-500">CareFully</span> died</p>
        </template>
      </Card>
    </div>
    <div class="flex gap-4">
      <p class="flex-shrink-0">19:30:30</p>
      <Card class="border border-gray-500 flex-grow">
        <template #content>
          <p>Round 2 started</p>
        </template>
      </Card>
    </div>
    <div class="flex gap-4">
      <p class="flex-shrink-0">19:30:22</p>
      <Card class="border border-gray-500 flex-grow">
        <template #content>
          <div class="px-2 py-0.5">
            <div class="flex justify-between items-center">
              <p class="font-semibold">Round 1 stats</p>
              <p>3 minutes 40 seconds</p>
            </div>
            <p>Winner: <span class="font-semibold">Team 2</span></p>
          </div>
          <hr class="border-t border-gray-400 mx-2 my-2" >
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-center font-bold my-4">
                <p>Team 1</p>
                <p class="text-red-600 text-xl">0</p>
              </div>
              <DataTable :value="match.teams[0]?.players" size="small">
                <Column field="name" header="Name"/>
                <Column field="runner" header="Runner"/>
                <Column field="kills" header="Kills"/>
                <Column field="deaths" header="Deaths"/>
                <Column field="stuns" header="Stuns"/>
                <Column field="damage" header="Damage"/>
              </DataTable>
            </div>
            <div>
              <div class="text-center font-bold my-4">
                <p>Team 2</p>
                <p class="text-green-600 text-xl">1</p>
              </div>
              <DataTable :value="match.teams[1]?.players" size="small">
                <Column field="name" header="Name"/>
                <Column field="runner" header="Runner"/>
                <Column field="kills" header="Kills"/>
                <Column field="deaths" header="Deaths"/>
                <Column field="stuns" header="Stuns"/>
                <Column field="damage" header="Damage"/>
              </DataTable>
            </div>
          </div>
        </template>
      </Card>
    </div>
    <div class="flex gap-4">
      <p class="flex-shrink-0">19:27:12</p>
      <Card class="border border-gray-500 flex-grow">
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
      <Card class="border border-gray-500 flex-grow">
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
      <Card class="border border-gray-500 flex-grow">
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
      <Card class="border border-gray-500 flex-grow">
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
      <Card class="border border-gray-500 flex-grow">
        <template #content>
          <p>Round 1 started</p>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ matchId: number }>();

const data = [
  {
    gameRule: {
      name: "Round Team Match BO5",
    },
    duration: "2 minutes 10 seconds",
    ended: false,
    winnerTeam: null,
    teams: [
      {
        wins: 0,
        players: [
          {
            name: "CareFully",
            kills: 1,
            stuns: 1,
            deaths: 1,
            damage: 360,
            runner: "Riot",
          },
          {
            name: "LordDeath115",
            kills: 1,
            stuns: 1,
            deaths: 1,
            damage: 360,
            runner: "Magus",
          },
          {
            name: "Pufin",
            kills: 0,
            stuns: 1,
            deaths: 1,
            damage: 143,
            runner: "Chillout",
          },
        ],
      },
      {
        wins: 1,
        players: [
          {
            name: "Cheeseman",
            kills: 2,
            stuns: 1,
            deaths: 0,
            damage: 360,
            runner: "Legacy",
          },
          {
            name: "Shroom",
            kills: 1,
            stuns: 2,
            deaths: 0,
            damage: 360,
            runner: "Valkyrie",
          },
          {
            name: "Omni",
            kills: 0,
            stuns: 1,
            deaths: 1,
            damage: 100,
            runner: "Chillout",
          },
        ],
      },
    ],
  },
  {
    gameRule: {
      name: "Round Team Match BO5",
    },
    duration: "15 minutes 25 seconds",
    ended: true,
    winnerTeam: 2,
    teams: [
      {
        wins: 1,
        players: [
          {
            name: "CareFully",
            kills: 1,
            stuns: 1,
            deaths: 3,
            damage: 1234,
            runner: "Riot",
          },
          {
            name: "LordDeath115",
            kills: 1,
            stuns: 1,
            deaths: 4,
            damage: 2003,
            runner: "Magus",
          },
          {
            name: "Pufin",
            kills: 2,
            stuns: 1,
            deaths: 3,
            damage: 900,
            runner: "Chillout",
          },
        ],
      },
      {
        wins: 3,
        players: [
          {
            name: "Cheeseman",
            kills: 5,
            stuns: 5,
            deaths: 1,
            damage: 1540,
            runner: "Legacy",
          },
          {
            name: "Shroom",
            kills: 1,
            stuns: 2,
            deaths: 2,
            damage: 500,
            runner: "Valkyrie",
          },
          {
            name: "Omni",
            kills: 2,
            stuns: 1,
            deaths: 1,
            damage: 650,
            runner: "Chillout",
          },
        ],
      },
    ],
  },
  {
    gameRule: {
      name: "Survival",
    },
    duration: "10 minutes 2 seconds",
    ended: true,
    winnerTeam: 1,
    teams: [
      {
        wins: 0,
        placement: 1,
        players: [
          {
            name: "CareFully",
            kills: 1,
            stuns: 1,
            deaths: 3,
            damage: 1234,
            runner: "Riot",
          },
        ],
      },
      {
        wins: 0,
        placement: 2,
        players: [
          {
            name: "Shroom",
            kills: 1,
            stuns: 2,
            deaths: 2,
            damage: 500,
            runner: "Valkyrie",
          },
        ],
      },
      {
        wins: 0,
        placement: 3,
        players: [
          {
            name: "Cheeseman",
            kills: 5,
            stuns: 5,
            deaths: 1,
            damage: 1540,
            runner: "Legacy",
          },
        ],
      },
    ],
  },
];

const match = computed(() => {
  return data[props.matchId]!;
});

const winnerTeam = computed(() => {
  if (!match.value.winnerTeam) {
    return "";
  }
  const winnerTeamIndex = match.value.winnerTeam;
  if (match.value.gameRule.name === "Round Team Match BO5") {
    const winnerTeamStats = match.value.teams[winnerTeamIndex - 1]!;
    return `Team ${winnerTeamIndex} (${winnerTeamStats.players.map((player) => player.name).join(", ")})`;
  } else {
    const winnerTeamStats = match.value.teams[winnerTeamIndex - 1]!;
    return winnerTeamStats.players[0]!.name;
  }
});

const allPlayers = computed(() => {
  return match.value.teams.reduce<
    {
      name: string;
      kills: number;
      stuns: number;
      deaths: number;
      damage: number;
      runner: string;
    }[]
  >((acc, team) => [...acc, ...team.players], []);
});
</script>
