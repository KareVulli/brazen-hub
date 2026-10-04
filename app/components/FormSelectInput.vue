<template>
  <FormInput>
    <FormFieldLabel :name="name" :label="label" />
    <Select
      v-model="value"
      :placeholder="placeholder"
      :options="options"
      option-label="name"
      option-value="value"
      fluid
      filter
      show-clear
    />
    <FormFieldError :error-message="errorMessage" />
  </FormInput>
</template>

<script
  setup
  lang="ts"
  generic="T extends { value: number | string; name: string }"
>
import { useField } from "vee-validate";
import type { FormFieldProps } from "./FormInput.vue";

interface FormSelectInputProps<
  T extends { name: string },
> extends FormFieldProps {
  placeholder?: string;
  options: T[];
}

const props = defineProps<FormSelectInputProps<T>>();

const { value, errorMessage } = useField(() => props.name);
</script>
