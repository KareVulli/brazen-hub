<template>
  <FormInput :name="name" :label="label">
    <template #field>
      <InputText :type="type" :placeholder="placeholder" fluid />
    </template>
  </FormInput>
</template>

<script setup lang="ts">
import type { InputTypeHTMLAttribute } from "vue";
import type { FormInputProps } from "./FormInput.vue";

interface TextFieldProps extends FormInputProps {
  type: InputTypeHTMLAttribute;
  placeholder?: string;
}

defineProps<TextFieldProps>();
</script>
