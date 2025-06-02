<template>
  <PageTitle :title="`${ruleset.name} - ${ruleset.stageName}`" />
  <p class="mb-4">
    This includes only data gathered from weekly challenges, since there is no
    other known way of getting solo game scores.
  </p>
  <p class="mb-4">Maximum of top 100 scores are shown.</p>
  <LeaderboardTable :entries="scores" :attempts="false" />
</template>

<script setup lang="ts">
const props = defineProps<{
  ruleset: RuleDto;
}>();

const { data } = await useFetch(`/api/target-challenges/${props.ruleset.id}`);

const scores = computed(() => data.value?.scores || []);
</script>
