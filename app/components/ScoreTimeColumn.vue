<template>
  <span>{{ $dayjs.duration(timeMs, "milliseconds").format("mm:ss.SSS") }}</span>
</template>

<script setup lang="ts">
defineProps<{
  timeMs: number;
}>();
</script>
