<template>
  <NuxtLink
    :to="{ path: '/search-user', query: { query: user.userKey } }"
    class="hover:text-blue-600 hover:dark:text-blue-500 hover:underline"
    :class="[variant === 'normal' ? 'font-semibold' : 'font-medium']"
  >
    <UserName :user="user" :variant="variant" :inline="inline" />
  </NuxtLink>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    user: BrazenUser;
    variant?: "normal" | "small" | "text";
    inline?: boolean;
  }>(),
  {
    variant: "normal",
  },
);
</script>
