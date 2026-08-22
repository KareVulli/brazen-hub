<template>
  <div class="relative flex-shrink-0" :class="sizeClasses[variant]">
    <img
      :class="sizeClasses[variant]"
      :src="`https://static.prod.brazenblaze.com/public-assets/profile-icon/thumbnail/${user.iconId}.png`"
    />
    <img
      class="absolute left-0 top-0"
      :class="sizeClasses[variant]"
      :src="`https://static.prod.brazenblaze.com/public-assets/profile-icon-frame/thumbnail/${user.iconFrameId}.png`"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    user: BrazenUser;
    variant?: "large" | "normal" | "small";
  }>(),
  {
    variant: "normal",
  },
);

const sizeClasses = {
  large: "size-12",
  normal: "size-8",
  small: "size-5",
};
</script>
