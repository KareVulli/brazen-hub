<template>
  <PageTitle title="Custom Matches" />
  <div class="grid gap-2 2xl:grid-cols-2">
    <NuxtLink
      v-for="match in matches"
      :key="match.id"
      :to="`/matches/${match.id}`"
    >
      <Card class="border border-slate-800 hover:bg-gray-800 duration-100">
        <template #content>
          <div class="px-2 py-0.5">
            <div class="flex justify-between items-center">
              <p class="font-semibold">
                Match #{{ match.id }} @
                <NuxtTime
                  :datetime="new Date(match.createdAt * 1000)"
                  date-style="full"
                  time-style="short"
                />
              </p>
              <p>
                {{
                  $dayjs(
                    $dayjs(match.createdAt * 1000).diff(
                      $dayjs(match.updatedAt * 1000),
                    ),
                  ).format("m [minutes] s [seconds]")
                }}
              </p>
            </div>
            <p>{{ match.gameRule.name }} | {{ match.stage.name }}</p>
          </div>
          <hr class="border-t border-gray-400 mx-2 my-2" />
          <table class="w-full">
            <tr v-for="team in match.teams" :key="team.id" class="font-bold">
              <td
                v-for="(teamUser, index) in team.teamUsers"
                :key="teamUser.id"
                class="px-2"
                :class="{
                  'py-1 rounded-s-md': index === 0,
                  'bg-green-500/20': isWinnerTeam(match, team.team),
                }"
              >
                <UserName :user="teamUser.user" />
              </td>
              <td
                :colspan="1 + maxPlayersPerTeam(match) - team.teamUsers.length"
                class="text-right py-1 pr-2 rounded-e-md w-full"
                :class="{
                  'text-green-500 bg-green-500/20': isWinnerTeam(
                    match,
                    team.team,
                  ),
                  'text-red-500': !isWinnerTeam(match, team.team),
                  'rounded-s-md': team.teamUsers.length === 0,
                }"
              >
                {{ team.wins }}
              </td>
            </tr>
          </table>
        </template>
      </Card>
    </NuxtLink>
    <NuxtLink to="/matches/0">
      <Card class="border border-green-400 hover:bg-gray-800 duration-100">
        <template #content>
          <div class="px-2 py-0.5">
            <div class="flex justify-between items-center">
              <p class="font-semibold">
                <span class="text-green-500 font-semibold">LIVE!</span> Match
                #421 @ Wednesday, July 1, 2026 at 6:10 AM
              </p>
              <p>2 minutes 10 seconds</p>
            </div>
            <p>Round Team Match BO5 | New York City (Day)</p>
          </div>
          <hr class="border-t border-gray-400 mx-2 my-2" />
          <div class="space-y-0.5">
            <div class="flex justify-between font-bold rounded-md px-2 py-0.5">
              <p>CareFully, LordDeath115, Pufin</p>
              <p class="text-green-500">1</p>
            </div>
            <div class="flex justify-between font-bold rounded-md px-2 py-0.5">
              <p>Cheeseman, Shroom, Omni</p>
              <p class="text-red-500">0</p>
            </div>
          </div>
        </template>
      </Card>
    </NuxtLink>
    <NuxtLink to="/matches/1">
      <Card class="border border-slate-800 hover:bg-gray-800 duration-100">
        <template #content>
          <div class="px-2 py-0.5">
            <div class="flex justify-between items-center">
              <p class="font-semibold">
                Match #420 @ Wednesday, July 1, 2026 at 6:00 AM
              </p>
              <p>2 minutes 10 seconds</p>
            </div>

            <p>Round Team Match BO5 | New York City (Day)</p>
          </div>
          <hr class="border-t border-gray-400 mx-2 my-2" />
          <div class="space-y-0.5">
            <div class="flex justify-between font-bold rounded-md px-2 py-0.5">
              <p>CareFully, LordDeath115, Pufin</p>
              <p class="text-red-500">1</p>
            </div>
            <div
              class="flex justify-between font-bold bg-green-500/20 rounded-md px-2 py-0.5"
            >
              <p>Cheeseman, Shroom, Omni</p>
              <p class="text-green-500">3</p>
            </div>
          </div>
        </template>
      </Card>
    </NuxtLink>
    <NuxtLink to="/matches/2">
      <Card class="border border-slate-800 hover:bg-gray-800 duration-100">
        <template #content>
          <div class="px-2 py-0.5">
            <div class="flex justify-between items-center">
              <p class="font-semibold">
                Match #419 @ Wednesday, June 25, 2026 at 6:32 PM
              </p>
              <p>10 minutes 2 seconds</p>
            </div>
            <p>Survival | New York City (Day)</p>
            <p>
              Winner:
              <span class="font-semibold">CareFully</span>
            </p>
          </div>
          <hr class="border-t border-gray-400 mx-2 my-2" />
          <div class="grid grid-cols-3 gap-0.5">
            <div
              class="flex justify-between font-bold rounded-md px-2 py-0.5 bg-green-500/20"
            >
              <p>CareFully</p>
              <p class="text-green-500">#1</p>
            </div>
            <div class="flex justify-between font-bold rounded-md px-2 py-0.5">
              <p>LordDeath115</p>
              <p class="text-red-100">#2</p>
            </div>
            <div class="flex justify-between font-bold rounded-md px-2 py-0.5">
              <p>Pufin</p>
              <p class="text-red-200">#3</p>
            </div>
            <div class="flex justify-between font-bold rounded-md px-2 py-0.5">
              <p>Cheeseman</p>
              <p class="text-red-300">#4</p>
            </div>
            <div class="flex justify-between font-bold rounded-md px-2 py-0.5">
              <p>Shroom</p>
              <p class="text-red-400">#5</p>
            </div>
            <div class="flex justify-between font-bold rounded-md px-2 py-0.5">
              <p>Omni</p>
              <p class="text-red-500">#6</p>
            </div>
          </div>
        </template>
      </Card>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps<{ matches: MatchDto[] }>();

function isWinnerTeam(match: MatchDto, team: number) {
  const winnerTeam = [...match.teams].sort((a, b) => b.wins - a.wins)[0];
  return winnerTeam?.team === team;
}

function maxPlayersPerTeam(match: MatchDto) {
  return Math.max(...match.teams.map((team) => team.teamUsers.length));
}
</script>
