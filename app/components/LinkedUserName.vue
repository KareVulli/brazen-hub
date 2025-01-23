<template>
  <NuxtLink
    :to="{ path: '/search-user', query: { query: user.userKey } }"
    class="hover:text-blue-600 hover:dark:text-blue-500 hover:underline"
    :class="[small ? 'font-semibold' : 'font-medium']"
  >
    <UserName :user="user" :small="small" />
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  user: BrazenUser;
  small?: boolean;
}>();
</script>
