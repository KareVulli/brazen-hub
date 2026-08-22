<template>
  <div
    :class="`${inline ? 'inline-flex' : 'flex min-w-0'} items-center ${variant === 'small' ? 'gap-1' : 'gap-2'}`"
  >
    <UserIcon v-if="variant !== 'text'" :user="user" :variant="variant" />
    <div class="flex-shrink overflow-hidden">
      <p
        v-if="showKey"
        class="text-sm text-gray-500 dark:text-gray-400 truncate"
      >
        ID: {{ user.userKey }}
      </p>
      <p class="truncate" :title="user.name">{{ user.name }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    user: BrazenUser;
    showKey?: boolean;
    variant?: "normal" | "small" | "text";
    inline?: boolean;
  }>(),
  {
    showKey: false,
    variant: "normal",
    inline: false,
  },
);
</script>
