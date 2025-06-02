<template>
  <div class="mb-4 flex flex-col sm:flex-row gap-2">
    <h1 class="text-lg mr-auto">{{ title }}</h1>
    <slot name="actions" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>();
</script>
