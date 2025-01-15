<template>
  <div class="space-y-4">
    <Form
      v-slot="$form"
      class="flex flex-row gap-2 items-start"
      :initial-values="{ username: username }"
      :resolver="resolver"
      @submit="onFormSubmit"
    >
      <div class="flex-grow flex flex-col gap-1">
        <InputText
          name="username"
          type="text"
          placeholder="Enter a username of user id"
          fluid
        />
        <Message
          v-if="$form.username?.invalid"
          severity="error"
          size="small"
          variant="simple"
          >{{ $form.username.error?.message }}</Message
        >
      </div>
      <Button type="submit" severity="secondary" label="Search" />
    </Form>
    <Panel v-if="data" :header="`User ID: ${data.user.userKey}`">
      <div class="flex items-center gap-2">
        <UserName :user="data.user" />
        <span>-</span>
        <span
          >Currently
          <span
            v-if="data.onlineStatus.online"
            class="text-green-500 font-bold"
          >
            online
          </span>
          <span v-else>offline</span></span
        >
      </div>
    </Panel>
    <Panel v-if="data" header="Known best Target Challenge scores">
      <TopScoreTable :scores="data.topScores" />
    </Panel>
    <p v-if="error">Did not find a user with specified query.</p>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";

const route = useRoute();

const schema = z.object({
  username: z.string().min(1).max(64),
});

const username = computed(() => route.query.query);

const resolver = zodResolver(schema);

async function onFormSubmit({ valid, values }: FormSubmitEvent) {
  if (valid) {
    await navigateTo({
      path: "/search-user",
      query: {
        query: (values as z.infer<typeof schema>).username,
      },
    });
  }
}

const { data, error } = await useFetch("/api/search-user", {
  query: { query: username },
  immediate: typeof username.value === "string" && username.value.length > 0,
});
</script>
