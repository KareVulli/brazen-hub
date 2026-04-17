<template>
  <Message v-if="errorMessage" severity="error" size="small" variant="simple">{{
    errorMessage
  }}</Message>
</template>

<script setup lang="ts">
interface FormFieldErrorProps {
  errorMessage?: string;
}
defineProps<FormFieldErrorProps>();
</script>
