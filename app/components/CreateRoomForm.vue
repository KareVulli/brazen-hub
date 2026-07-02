<template>
  <div v-if="stages && gameRules">
    <form class="flex flex-col gap-2 items-start mt-4" @submit="onSubmit">
      <h2>Create a room</h2>
      <div class="space-y-2 w-full">
        <div class="grid grid-cols-2 gap-2">
          <FormSelectInput name="stageId" label="Stage" :options="stages" />
          <FormSelectInput
            name="gameRuleId"
            label="Game rule"
            :options="gameRules"
          />
        </div>
        <FormCheckboxInput name="public" label="Make public" />
        <FormListInput
          name="players"
          label="Players"
          :new-initial-value="{ userId: null, team: 0 }"
        >
          <template #fields="{ itemName }">
            <div class="flex gap-2">
              <FormPlayerInput
                :name="`${itemName}.userKey`"
                label="Player ID"
                type="text"
              />
              <FormSelectInput
                :name="`${itemName}.team`"
                label="Team"
                :options="teams"
              />
            </div>
          </template>
        </FormListInput>
      </div>
      <Button type="submit" severity="secondary" label="Create room" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { useFieldValue, useForm } from "vee-validate";
import { z } from "zod";
import { roomSchema } from "~~/validation/roomSchema";
import type { GameRuleDto } from "~~/server/utils/gameRule";

const toast = useToast();

const emit = defineEmits<{
  created: [];
}>();

const roomFormSchema = roomSchema.extend(
  z.object({
    gameRuleId: z
      .object({ id: z.number() })
      .transform((gameRule) => gameRule.id),
    stageId: z.object({ id: z.number() }).transform((stage) => stage.id),
    players: z
      .array(
        z.object({
          userKey: z
            .object({ userKey: z.string().min(1) })
            .transform((user) => user.userKey),
          team: z.object({ value: z.number() }).transform((team) => team.value),
        }),
      )
      .min(1),
  }).shape,
);

const { handleSubmit } = useForm({
  validationSchema: roomFormSchema,
});

const { data: stages } = await useFetch("/api/stages");
const { data: gameRules } = await useFetch("/api/game-rules");

const gameRule = useFieldValue<GameRuleDto>("gameRuleId");
const teams = computed(() => {
  const teamsCount = gameRule.value?.teamCount || 0;
  const options = [];
  for (let i = 1; i <= teamsCount; i++) {
    options.push({ name: `Team ${i}`, value: i });
  }
  return options;
});

const onSubmit = handleSubmit(async (values) => {
  console.log(values);
  try {
    await $fetch("/api/manage/rooms", {
      method: "POST",
      body: values,
    });
    emit("created");
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error creating room",
      detail: error instanceof Error ? error.message : String(error),
      life: 3000,
    });
    return;
  }
});
</script>
