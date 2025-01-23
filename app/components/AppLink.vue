<template>
  <NuxtLink :to="to" class="font-medium text-primary-500 hover:underline">
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
import type { NuxtLinkProps } from "#app";

defineProps<{ to: NuxtLinkProps["to"] }>();
</script>
