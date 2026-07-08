<template>
  <div
    :class="`${inline ? 'inline-flex' : 'flex'} items-center ${variant === 'small' ? 'gap-1' : 'gap-2'}`"
  >
    <div v-if="variant === 'normal'" class="relative w-8">
      <img
        class="h-8"
        :src="`https://static.prod.brazenblaze.com/public-assets/profile-icon/thumbnail/${user.iconId}.png`"
      />
      <img
        class="h-8 absolute left-0 top-0"
        :src="`https://static.prod.brazenblaze.com/public-assets/profile-icon-frame/thumbnail/${user.iconFrameId}.png`"
      />
    </div>
    <div v-if="variant === 'small'" class="relative w-5">
      <img
        class="h-5"
        :src="`https://static.prod.brazenblaze.com/public-assets/profile-icon/thumbnail/${user.iconId}.png`"
      />
      <img
        class="h-5 absolute left-0 top-0"
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
