<template>
  <template v-if="match">
    <PageTitle :title="`Match #${match.id}`">
      <template #actions>
        <NuxtTime
          :datetime="new Date(match.createdAt * 1000)"
          date-style="full"
          time-style="short"
        />
        <CopyLinkButton
          class="shrink-0 whitespace-nowrap"
          :content="fullUrl"
          label="Copy match link"
        />
      </template>
    </PageTitle>
    <Panel :header="match.gameRule.name" class="mb-4">
      <template #icons>
        <p>{{ duration }}</p>
      </template>
      <p>New York City (Day)</p>
      <p v-if="match.endedAt === null" class="text-green-500 font-semibold">
        Match in progress
      </p>
      <p v-else-if="match.gameRule.gameRuleType !== 'PlayGround'">
        Winner: <span class="font-semibold">{{ winnerTeam }}</span>
      </p>
    </Panel>

    <MatchStats :game-rule="match.gameRule" :teams="match.teams" />
    <hr class="border-t border-surface-200 dark:border-surface-700 my-4" />
    <PageTitle title="Match log">
      <template #actions>
        <Button
          v-if="match.endedAt === null"
          label="Refresh"
          icon="pi pi-refresh"
          size="small"
          severity="secondary"
          :disabled="pending"
          @click="onRefresh"
        />
      </template>
    </PageTitle>
    <div class="space-y-2">
      <div
        v-for="event in hydratedEvents"
        :key="event.id"
        class="flex flex-col lg:flex-row lg:gap-4"
      >
        <p class="flex-shrink-0 w-24 py-2">
          <NuxtTime
            class="whitespace-nowrap"
            :datetime="event.eventAt"
            time-style="medium"
          />
        </p>
        <Card
          class="border border-surface-200 dark:border-surface-700 flex-grow"
          :pt="{ body: { class: 'py-2 px-4' } }"
        >
          <template #content>
            <p v-if="event.name === 'kill'">
              <template v-if="event.data.sourceUser && event.data.targetUser">
                <span
                  class="font-semibold"
                  :class="getTeamClass(event.data.sourceUser)"
                >
                  {{ event.data.sourceUser.user.name }}
                </span>
                killed
                <span
                  class="font-semibold"
                  :class="getTeamClass(event.data.targetUser)"
                >
                  {{ event.data.targetUser.user.name }}
                </span>
              </template>
              <template v-else-if="event.data.targetUser">
                <span
                  class="font-semibold"
                  :class="getTeamClass(event.data.targetUser)"
                >
                  {{ event.data.targetUser.user.name }}
                </span>
                died
              </template>
            </p>
            <p v-else-if="event.name === 'stun'">
              <template v-if="event.data.sourceUser && event.data.targetUser">
                <span
                  class="font-semibold"
                  :class="getTeamClass(event.data.sourceUser)"
                >
                  {{ event.data.sourceUser.user.name }}
                </span>
                stunned
                <span
                  class="font-semibold"
                  :class="getTeamClass(event.data.targetUser)"
                >
                  {{ event.data.targetUser.user.name }}
                </span>
              </template>
              <template v-else-if="event.data.targetUser">
                <span
                  class="font-semibold"
                  :class="getTeamClass(event.data.targetUser)"
                >
                  {{ event.data.targetUser.user.name }}
                </span>
                got stunned
              </template>
            </p>
            <p v-else-if="event.name === 'revive'">
              <template v-if="event.data.sourceUser && event.data.targetUser">
                <span
                  class="font-semibold"
                  :class="getTeamClass(event.data.sourceUser)"
                >
                  {{ event.data.sourceUser.user.name }}
                </span>
                revived
                <span
                  class="font-semibold"
                  :class="getTeamClass(event.data.targetUser)"
                  >{{ event.data.targetUser.user.name }}</span
                >
              </template>
              <template v-else-if="event.data.targetUser">
                <span
                  class="font-semibold"
                  :class="getTeamClass(event.data.targetUser)"
                >
                  {{ event.data.targetUser.user.name }}
                </span>
                revived
              </template>
            </p>
            <p v-else-if="event.name === 'round-start'">
              Round {{ event.data.round }} started
            </p>
            <div v-else-if="event.name === 'round-end'" class="py-2">
              <div class="flex justify-between items-center">
                <p class="font-semibold">Round {{ event.data.round }} stats</p>
                <p>{{ event.data.duration }}</p>
              </div>
              <p>
                Winner:
                <span class="font-semibold">
                  {{ getTeamName(event.data.winnerTeam) }}
                </span>
              </p>
              <hr
                class="border-t border-surface-200 dark:border-surface-700 mt-2"
              />
              <MatchStats
                :game-rule="match.gameRule"
                :teams="event.data.teams"
                compact
              />
            </div>
            <p v-else-if="event.name === 'disconnect'">
              <template v-if="event.data.targetUser">
                <span class="pi pi-wave-pulse mr-2 text-gray-500" />
                <span
                  class="font-semibold"
                  :class="getTeamClass(event.data.targetUser)"
                >
                  {{ event.data.targetUser.user.name }}
                </span>
                disconnected
              </template>
            </p>
          </template>
        </Card>
      </div>
      <p v-if="!hydratedEvents.length" class="font-semibold mb-4">
        Nothing has happened yet...
      </p>
    </div>
  </template>
</template>

<script setup lang="ts">
import type { TeamUserDto } from "~~/server/utils/teamUser.ts";
const props = defineProps<{ matchId: number }>();

const dayjs = useDayjs();
const formatDuration = useFormatDuration();
const url = useRequestURL();
const fullUrl = computed(() => url.toString());

const teamBasedGameRuleTypes = ["RoundMatch", "StockMatch", "Duel"];

const { data, refresh, pending } = await useFetch(
  `/api/matches/${props.matchId}`,
);

const match = computed(() => data.value?.match);
const events = computed(() => data.value?.events || []);

const winnerTeam = computed(() => {
  if (!match.value) {
    return "";
  }
  const winnerTeam = [...match.value.teams].sort((a, b) => b.wins - a.wins)[0];
  if (!winnerTeam) {
    return "";
  }
  if (teamBasedGameRuleTypes.includes(match.value.gameRule.gameRuleType)) {
    return `Team ${winnerTeam.team} (${winnerTeam.teamUsers.map((teamUser) => teamUser.user.name).join(", ")})`;
  } else {
    return winnerTeam.teamUsers[0]?.user.name || "";
  }
});

const allPlayers = computed(() => {
  if (!match.value) {
    return [];
  }
  return match.value.teams.reduce<(TeamUserDto & { team: TeamDto })[]>(
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

async function onRefresh() {
  await refresh();
}

function getPlayerByUserKey(userKey: string) {
  return (
    allPlayers.value.find((player) => player.user.userKey === userKey) || null
  );
}

function getTeamClass(player: TeamUserDto & { team: TeamDto }) {
  return teamClass[player.team.team - 1];
}

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

const hydratedEvents = computed(() => {
  const hydratedEvents = [];
  for (const event of events.value) {
    const eventAt = new Date(event.eventAt * 1000);
    if (
      event.name === "kill" ||
      event.name === "stun" ||
      event.name === "revive"
    ) {
      const sourceUser = event.data.sourceUserKey
        ? getPlayerByUserKey(event.data.sourceUserKey)
        : null;
      const targetUser = getPlayerByUserKey(event.data.targetUserKey);
      hydratedEvents.push({
        ...event,
        data: {
          ...event.data,
          sourceUser: sourceUser,
          targetUser: targetUser,
        },
        eventAt: eventAt,
      });
    } else if (event.name === "round-end") {
      const teams = new Map<number, TeamDto>();
      const teamStats = event.data.teams;
      for (const [userKey, stats] of Object.entries(event.data.players)) {
        const player = getPlayerByUserKey(userKey);
        if (!player) {
          continue;
        }
        let team = teams.get(player.team.team);
        if (!team) {
          team = {
            ...player.team,
            ...teamStats[player.team.team],
            teamUsers: [],
          };
          teams.set(player.team.team, team);
        }
        team.teamUsers.push({ ...player, ...stats });
      }
      const winnerTeam = teams.get(event.data.winnerTeamIndex)!;
      hydratedEvents.push({
        ...event,
        eventAt: eventAt,
        data: {
          ...event.data,
          duration: formatDuration(
            dayjs(event.data.endedAt * 1000).diff(
              dayjs(event.data.startedAt * 1000),
            ),
          ),
          teams: [...teams.values()].sort((a, b) => a.team - b.team),
          winnerTeam: winnerTeam,
        },
      });
    } else if (event.name === "disconnect") {
      const targetUser = getPlayerByUserKey(event.data.targetUserKey);
      hydratedEvents.push({
        ...event,
        data: {
          ...event.data,
          targetUser: targetUser,
        },
        eventAt: eventAt,
      });
    } else {
      hydratedEvents.push({ ...event, eventAt: eventAt });
    }
  }
  return hydratedEvents;
});

const duration = computed(() => {
  if (!match.value) {
    return "";
  }
  if (match.value.endedAt === null) {
    return formatDuration(dayjs().diff(dayjs(match.value.createdAt * 1000)));
  }

  return formatDuration(
    dayjs(match.value.endedAt * 1000).diff(dayjs(match.value.createdAt * 1000)),
  );
});

const teamClass = [
  "text-blue-500",
  "text-red-500",
  "text-green-500",
  "text-teal-500",
  "text-purple-500",
  "text-yellow-500",
];
</script>
