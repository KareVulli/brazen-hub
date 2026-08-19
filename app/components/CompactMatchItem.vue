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
    <MatchItemPlayers :match="match" />
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{ match: MatchDto }>();
</script>
