<template>
  <FormInput :name="name" :label="label">
    <template #field>
      <Select
        :placeholder="placeholder"
        :options="options"
        option-label="name"
        fluid
        filter
      />
    </template>
  </FormInput>
</template>

<script setup lang="ts" generic="T extends { name: string }">
import type { FormInputProps } from "./FormInput.vue";

interface FormSelectInputProps<T extends { name: string }>
  extends FormInputProps {
  placeholder?: string;
  options: T[];
}

defineProps<FormSelectInputProps<T>>();
</script>
