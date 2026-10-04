<template>
  <div class="space-y-4">
    <form class="flex flex-row gap-2 items-start" @submit="onSubmit">
      <FormTextInput
        name="username"
        label=""
        placeholder="Enter a username of user id"
        type="text"
        dense
      />
      <Button type="submit" severity="secondary" label="Search" />
    </form>
    <p v-if="data && 'users' in data && data.users.length === 0">
      Did not find a user with specified query.
    </p>
    <UsersList v-else-if="data && 'users' in data" :users="data.users" />
    <UserInfo v-else-if="data && 'user' in data" :user="data" />
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";
import { useForm } from "vee-validate";
import { useRoute } from "#app";

const route = useRoute();

const username = computed(() => route.query.query);

const { data } = await useFetch("/api/search-user", {
  query: { query: username },
});

useHead({
  title: computed(() => {
    if (data.value && "user" in data.value) {
      return `${data.value.user.name} - Player Info`;
    }
    return "Player Search";
  }),
});

const schema = z.object({
  username: z.string().min(1).max(64),
});

const { handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: {
    username: typeof username.value === "string" ? username.value : "",
  },
});

const onSubmit = handleSubmit(async (values) => {
  await navigateTo({
    query: {
      query: values.username,
    },
  });
});
</script>
