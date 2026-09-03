<template>
  <Button
    v-tooltip.focus.top="{
      value: message,
      pt: {
        text: 'text-sm',
        root: '!max-w-96',
      },
    }"
    icon="pi pi-info-circle"
    severity="info"
    size="small"
    rounded
    text
  />
</template>

<script setup lang="ts">
defineProps<{
  message: string;
}>();
</script>
