<template>
  <div v-if="stages && gameRules">
    <form class="flex flex-col gap-2 items-start mt-4" @submit="onSubmit">
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
    </form>
  </div>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { roomSchema } from "~~/validation/roomSchema";

const emit = defineEmits<{
  created: [];
}>();

const roomFormSchema = roomSchema.extend(
  z.object({
    gameRuleId: z
      .object({ id: z.number() })
      .transform((gameRule) => gameRule.id),
    stageId: z.object({ id: z.number() }).transform((stage) => stage.id),
  }).shape,
);

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(roomFormSchema),
});

const { data: stages } = await useFetch("/api/stages");
const { data: gameRules } = await useFetch("/api/game-rules");

const onSubmit = handleSubmit(async (values) => {
  await $fetch("/api/manage/rooms", {
    method: "POST",
    body: values,
  });
  emit("created");
});
</script>
