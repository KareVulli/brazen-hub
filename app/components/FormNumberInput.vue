<template>
  <FormInput>
    <FormFieldLabel :name="name" :label="label" />
    <InputNumber v-model="value" :placeholder="placeholder" fluid />
    <FormFieldError :error-message="errorMessage" />
  </FormInput>
</template>

<script setup lang="ts">
import { useField } from "vee-validate";
import type { FormFieldProps } from "./FormInput.vue";

interface NumberFieldProps extends FormFieldProps {
  placeholder?: string;
  min?: number;
  max?: number;
}

const props = defineProps<NumberFieldProps>();

const { value, errorMessage } = useField<number | undefined>(() => props.name);
</script>
