<template>
  <div class="w-full flex flex-col gap-2" :class="{ 'my-1': !dense }">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface FormInputProps {
  dense?: boolean;
}

export interface FormFieldProps extends FormInputProps {
  name: string;
  label: string;
}

defineProps<FormInputProps>();
</script>
