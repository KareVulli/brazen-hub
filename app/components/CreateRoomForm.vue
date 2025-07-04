<template>
  <div v-if="stages && gameRules">
    <Form
      :resolver="resolver"
      class="flex flex-col gap-2 items-start mt-4"
      @submit="onFormSubmit"
    >
      <h2>Create a room</h2>
      <div class="grid grid-cols-1 gap-2 w-full">
        <FormSelectInput name="stageId" label="Stage" :options="stages" />
        <FormSelectInput
          name="gameRuleId"
          label="Game rule"
          :options="gameRules"
        />
        <FormCheckboxInput name="public" label="Make public" />
      </div>
      <Button type="submit" severity="secondary" label="Create room" />
    </Form>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { roomSchema } from "~~/validation/roomSchema";

const emit = defineEmits<{
  created: [];
}>();

const roomFormSchema = roomSchema.merge(
  z.object({
    gameRuleId: z
      .object({ id: z.number() })
      .transform((gameRule) => gameRule.id),
    stageId: z.object({ id: z.number() }).transform((stage) => stage.id),
  })
);

const { data: stages } = await useFetch("/api/stages");
const { data: gameRules } = await useFetch("/api/game-rules");

const resolver = zodResolver(roomFormSchema);

const onFormSubmit = async ({ valid, values }: FormSubmitEvent) => {
  if (valid) {
    await $fetch("/api/manage/rooms", {
      method: "POST",
      body: values,
    });
    emit("created");
  }
};
</script>
