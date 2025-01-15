<template>
  <div class="flex items-center gap-2 relative">
    <img
      class="h-8 flex-shrink-0"
      :src="`https://static.prod.brazenblaze.com/public-assets/profile-icon/thumbnail/${user.iconId}.png`"
    />
    <img
      class="h-8 absolute left-0 top-0"
      :src="`https://static.prod.brazenblaze.com/public-assets/profile-icon-frame/thumbnail/${user.iconFrameId}.png`"
    />
    {{ user.name }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  user: BrazenUser;
}>();
</script>
