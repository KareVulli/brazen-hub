<template>
  <div class="mb-4 flex flex-row gap-2 items-center">
    <UserIcon :user="user.user" variant="large" />
    <div class="mr-auto">
      <h1 class="text-lg">{{ user.user.name }}</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
        ID: {{ user.user.userKey }}
      </p>
    </div>
    <span v-if="user.user.online" class="text-green-500 font-bold">
      Online
    </span>
    <span v-else>Offline</span>
  </div>
  <Panel
    v-if="user.recentMatches.length > 0"
    header="Stats"
    :pt="{
      contentWrapper: { class: 'min-w-0' },
    }"
  >
    <p>
      <span>
        KDR:
        <template v-if="user.stats.totalDeaths > 0">{{
          (user.stats.totalKills / user.stats.totalDeaths).toFixed(2)
        }}</template>
        <template v-else>{{ user.stats.totalKills.toFixed(2) }}</template>

        ({{ user.stats.totalKills }} kills /
        {{ user.stats.totalDeaths }} deaths)
        <InfoButton message="Kill / Death Ratio" />
      </span>
    </p>
    <p v-if="user.stats.damagePerRound > 0">
      <span>
        ADR:
        {{ Math.round(user.stats.damagePerRound) }}
        <InfoButton
          :message="`Average Damage per Round (based on ${user.stats.damagePerRoundMatches} Round Team Matches)`"
        />
      </span>
    </p>
    <div class="grid xl:grid-cols-2">
      <div>
        <span>Most used characters</span>
        <UserStatChart :stats="user.stats.mostUsedCharacters" />
      </div>
      <div>
        <span>Most used sub-weapons</span>
        <UserStatChart :stats="user.stats.mostUsedItems" />
      </div>
      <div>
        <span>Most played stages</span>
        <UserStatChart :stats="user.stats.mostPlayedStages" />
      </div>
      <div>
        <span>Most played rulesets</span>
        <UserStatChart :stats="user.stats.mostPlayedGameRules" />
      </div>
    </div>
  </Panel>
  <UserMatches :user-key="user.user.userKey" :matches="user.recentMatches" />
  <Panel
    header="Known best Target Challenge scores"
    :pt="{ contentWrapper: { class: 'min-w-0' } }"
  >
    <UserScoreTable :scores="user.topScores" />
  </Panel>
</template>

<script setup lang="ts">
import type { SearchUserResult } from "~~/server/api/search-user.get";

defineProps<{ user: SearchUserResult }>();
</script>
