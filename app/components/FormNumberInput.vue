<template>
  <FormInput :name="name" :label="label">
    <template #field>
      <InputNumber :placeholder="placeholder" fluid />
    </template>
  </FormInput>
</template>

<script setup lang="ts">
import type { FormInputProps } from "./FormInput.vue";

interface NumberFieldProps extends FormInputProps {
  placeholder?: string;
  min?: number;
  max?: number;
}

defineProps<NumberFieldProps>();
</script>
