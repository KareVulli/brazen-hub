<template>
  <FormField
    v-slot="$field"
    :name="name"
    class="w-full flex flex-col gap-2 my-1"
  >
    <label :for="name" class="block font-semibold">{{ label }}</label>
    <slot name="field" />
    <Message
      v-if="$field?.invalid"
      severity="error"
      size="small"
      variant="simple"
      >{{ $field.error?.message }}</Message
    >
  </FormField>
</template>

<script setup lang="ts">
export interface FormInputProps {
  name: string;
  label: string;
}
defineProps<FormInputProps>();
</script>
