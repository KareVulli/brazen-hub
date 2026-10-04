<template>
  <div>
    <form class="flex flex-col gap-2 items-start mt-4" @submit="onSubmit">
      <h2>Create a room</h2>
      <div class="space-y-2 w-full">
        <div class="grid grid-cols-2 gap-2">
          <FormSelectInput
            name="stageId"
            label="Stage"
            :options="stageOptions"
          />
          <FormSelectInput
            name="gameRuleId"
            label="Game rule"
            :options="gameRuleOptions"
          />
        </div>
        <FormCheckboxInput name="public" label="Make public" />
        <FormListInput
          name="players"
          label="Players"
          :new-initial-value="{ userKey: null, team: 0 }"
        >
          <template #fields="{ itemName }">
            <div class="flex gap-2">
              <FormPlayerInput
                :name="`${itemName}.userKey`"
                label="Player ID"
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
import { roomSchema } from "~~/validation/roomSchema";

const toast = useToast();

const emit = defineEmits<{
  created: [];
}>();

const roomFormSchema = roomSchema;

const { handleSubmit } = useForm({
  validationSchema: roomFormSchema,
});

const { data: stages } = await useFetch("/api/stages");
const { data: gameRules } = await useFetch("/api/game-rules");
const stageOptions = computed(() => {
  return (stages.value || []).map((item) => ({
    value: item.id,
    name: item.name,
  }));
});
const gameRuleOptions = computed(() => {
  return (gameRules.value || []).map((item) => ({
    value: item.id,
    name: item.name,
  }));
});

const gameRuleId = useFieldValue<number>("gameRuleId");
const gameRule = computed(() => {
  return gameRules.value?.find((rule) => rule.id === gameRuleId.value);
});
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
