<template>
  <FormInput>
    <FormFieldLabel :name="name" :label="label" />
    <DatePicker
      v-model="value"
      show-time
      show-icon
      show-button-bar
      hour-format="24"
      :placeholder="placeholder"
      fluid
    />
    <FormFieldError :error-message="errorMessage" />
  </FormInput>
</template>

<script setup lang="ts">
import { useField } from "vee-validate";
import type { FormFieldProps } from "./FormInput.vue";

interface DatetimeFieldProps extends FormFieldProps {
  placeholder?: string;
}

const props = defineProps<DatetimeFieldProps>();

const { value, errorMessage } = useField<Date | undefined>(() => props.name);
</script>
