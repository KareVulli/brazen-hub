<template>
  <FormInput>
    <FormFieldLabel :name="name" :label="label" />
    <AutoComplete
      v-model="value"
      :placeholder="placeholder"
      :suggestions="filteredPlayers"
      option-label="name"
      :loading="loading"
      show-empty-message
      fluid
      filter
      force-selection
      @complete="search"
      ><template #option="{ option }: { option: BrazenAPIUser }">
        <UserName :user="{ id: 0, ...option }" show-key />
      </template>
    </AutoComplete>
    <FormFieldError :error-message="errorMessage" />
  </FormInput>
</template>

<script setup lang="ts">
import { useField } from "vee-validate";
import type { FormFieldProps } from "./FormInput.vue";
import type { AutoCompleteCompleteEvent } from "primevue";
import UserName from "./UserName.vue";

interface FormSelectInputProps extends FormFieldProps {
  placeholder?: string;
}

const props = defineProps<FormSelectInputProps>();

const filteredPlayers = ref<BrazenAPIUser[]>([]);
const loading = ref<boolean>(false);

async function search(event: AutoCompleteCompleteEvent) {
  loading.value = true;
  try {
    const response = await $fetch("/api/search-user", {
      query: {
        query: event.query,
      },
    });
    if ("users" in response) {
      filteredPlayers.value = response.users;
    } else {
      filteredPlayers.value = [response.user];
    }
  } catch {
    filteredPlayers.value = [];
  } finally {
    loading.value = false;
  }
}

const { value, errorMessage } = useField(() => props.name, undefined, {
  validateOnValueUpdate: false,
});
</script>
