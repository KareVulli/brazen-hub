<template>
  <div class="flex items-center gap-2">
    <div v-if="!small" class="relative">
      <img
        class="h-8 flex-shrink-0"
        :src="`https://static.prod.brazenblaze.com/public-assets/profile-icon/thumbnail/${user.iconId}.png`"
      />
      <img
        class="h-8 absolute left-0 top-0"
        :src="`https://static.prod.brazenblaze.com/public-assets/profile-icon-frame/thumbnail/${user.iconFrameId}.png`"
      />
    </div>
    <div>
      <p v-if="showKey" class="text-sm text-gray-500 dark:text-gray-400">
        ID: {{ user.userKey }}
      </p>
      <p>{{ user.name }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  user: BrazenUser;
  showKey?: boolean;
  small?: boolean;
}>();
</script>
