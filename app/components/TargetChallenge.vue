<template>
  <h1 class="mb-4 text-lg">{{ ruleset.name }} - {{ ruleset.stageName }}</h1>
  <p>
    WORK IN PROGRESS: Aggregated results from weekly challenges will be shown
    here!
  </p>
</template>

<script setup lang="ts">
defineProps<{
  ruleset: RuleDto;
}>();
</script>
