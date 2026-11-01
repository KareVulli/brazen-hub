<template>
  <Tag v-if="match.endedAt === null" severity="success"> Live! </Tag>
  <Tag v-else-if="match.errored" severity="danger">Errored</Tag>
  <Tag v-else-if="match.ranked" severity="info">Ranked</Tag>
  <Tag v-else severity="secondary">Unranked</Tag>
</template>

<script setup lang="ts">
defineProps<{ match: MatchDto }>();
</script>
