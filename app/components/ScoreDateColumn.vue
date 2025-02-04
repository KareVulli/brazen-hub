<template>
  <NuxtTime
    v-tooltip="$dayjs(dateTimestamp * 1000).format('YYYY-MM-DD HH:mm')"
    class="cursor-default"
    :datetime="new Date(dateTimestamp * 1000)"
    relative
  />
</template>

<script setup lang="ts">
defineProps<{
  dateTimestamp: number;
}>();
</script>
