<template>
  <label :for="name" class="block font-semibold">{{ label }}</label>
</template>

<script setup lang="ts">
import type { FormFieldProps } from "./FormInput.vue";

defineProps<FormFieldProps>();
</script>
