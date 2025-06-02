<template>
  <FormInput :name="name" :label="label">
    <template #field>
      <DatePicker
        show-time
        show-icon
        show-button-bar
        hour-format="24"
        :placeholder="placeholder"
        fluid
      />
    </template>
  </FormInput>
</template>

<script setup lang="ts">
import type { FormInputProps } from "./FormInput.vue";

interface DatetimeFieldProps extends FormInputProps {
  placeholder?: string;
}

defineProps<DatetimeFieldProps>();
</script>
