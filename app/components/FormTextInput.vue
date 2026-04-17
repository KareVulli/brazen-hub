<template>
  <FormInput :dense="dense">
    <FormFieldLabel v-if="label" :name="name" :label="label" />
    <InputText v-model="value" :type="type" :placeholder="placeholder" fluid />
    <FormFieldError :error-message="errorMessage" />
  </FormInput>
</template>

<script setup lang="ts">
import type { InputTypeHTMLAttribute } from "vue";
import type { FormFieldProps } from "./FormInput.vue";
import { useField } from "vee-validate";

interface TextFieldProps extends FormFieldProps {
  type: InputTypeHTMLAttribute;
  placeholder?: string;
}

const props = defineProps<TextFieldProps>();

const { value, errorMessage } = useField<string | undefined>(() => props.name);
</script>
