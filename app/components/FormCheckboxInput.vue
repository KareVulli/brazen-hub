<template>
  <FormInput :name="name" :label="label">
    <template #field>
      <Checkbox binary />
    </template>
  </FormInput>
</template>

<script setup lang="ts">
import type { FormInputProps } from "./FormInput.vue";

defineProps<FormInputProps>();
</script>
