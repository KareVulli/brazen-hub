<template>
  <FormInput>
    <FormFieldLabel :name="name" :label="label" />
    <AutoComplete
      v-model="selectedOptions"
      :placeholder="placeholder"
      :suggestions="filteredPlayers"
      option-label="name"
      :loading="loading"
      show-empty-message
      fluid
      filter
      force-selection
      :multiple="multiple"
      @complete="search"
    >
      <template #option="{ option }: { option: BrazenAPIUser }">
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
  multiple?: boolean;
}

const props = defineProps<FormSelectInputProps>();

const { value, errorMessage } = useField<null | string | string[]>(
  () => props.name,
  undefined,
  {
    validateOnValueUpdate: false,
  },
);

const initialValue = [value.value ?? []].flat().slice(0, 6);
const { data: initialUsers } = useFetch("/api/users", {
  query: { userKeys: initialValue, pageSize: initialValue.length },
  immediate: initialValue.length > 0,
});

const cachedUsers = ref<Map<string, BrazenAPIUser>>(new Map());
const cachedUsersMap = computed(() => {
  const users = new Map<string, BrazenAPIUser>();
  for (const user of initialUsers.value?.results ?? []) {
    users.set(user.userKey, user);
  }
  for (const [userKey, user] of cachedUsers.value) {
    users.set(userKey, user);
  }
  return users;
});
const filteredPlayers = ref<BrazenAPIUser[]>([]);

const loading = ref<boolean>(false);
const selectedOptions = computed({
  get(): null | BrazenAPIUser | BrazenAPIUser[] {
    const currentValue = value.value;
    if (!currentValue) {
      return null;
    }
    if (!Array.isArray(currentValue)) {
      return (
        cachedUsersMap.value.get(currentValue) ?? {
          name: currentValue,
          userKey: currentValue,
          iconId: 0,
          iconFrameId: 0,
        }
      );
    }
    return currentValue.map(
      (item) =>
        cachedUsersMap.value.get(item) ?? {
          name: item,
          userKey: item,
          iconId: 0,
          iconFrameId: 0,
        },
    );
  },
  set(newValue: null | BrazenAPIUser | BrazenAPIUser[]) {
    if (Array.isArray(newValue)) {
      for (const user of newValue) {
        cachedUsers.value.set(user.userKey, user);
      }
      value.value = newValue.map((item) => item.userKey);
    } else if (newValue) {
      cachedUsers.value.set(newValue.userKey, newValue);
      value.value = newValue.userKey;
    } else {
      value.value = null;
    }
  },
});

async function search(event: AutoCompleteCompleteEvent) {
  loading.value = true;
  try {
    const response = await $fetch("/api/users", {
      query: {
        query: event.query,
      },
    });
    filteredPlayers.value = response.results;
  } catch {
    filteredPlayers.value = [];
  } finally {
    loading.value = false;
  }
}
</script>
