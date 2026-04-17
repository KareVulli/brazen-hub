<template>
  <FormInput>
    <FormFieldLabel :name="name" :label="label" />
    <Select
      v-model="value"
      :placeholder="placeholder"
      :options="options"
      option-label="name"
      fluid
      filter
    />
    <FormFieldError :error-message="errorMessage" />
  </FormInput>
</template>

<script setup lang="ts" generic="T extends { name: string }">
import { useField } from "vee-validate";
import type { FormFieldProps } from "./FormInput.vue";

interface FormSelectInputProps<T extends { name: string }>
  extends FormFieldProps {
  placeholder?: string;
  options: T[];
}

const props = defineProps<FormSelectInputProps<T>>();

const { value, errorMessage } = useField(() => props.name);
</script>
