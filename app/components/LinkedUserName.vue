<template>
  <NuxtLink
    :to="{ path: '/search-user', query: { query: user.userKey } }"
    class="font-medium hover:text-blue-600 hover:dark:text-blue-500 hover:underline"
  >
    <UserName :user="user" />
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  user: BrazenUser;
}>();
</script>
