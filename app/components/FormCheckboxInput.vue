<template>
  <FormInput>
    <FormFieldLabel :name="name" :label="label" />
    <Checkbox v-model="value" binary />
    <FormFieldError :error-message="errorMessage" />
  </FormInput>
</template>

<script setup lang="ts">
import { useField } from "vee-validate";
import type { FormFieldProps } from "./FormInput.vue";

const props = defineProps<FormFieldProps>();

const { value, errorMessage } = useField(() => props.name);
</script>
