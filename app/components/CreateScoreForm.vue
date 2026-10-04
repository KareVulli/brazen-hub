<template>
  <div v-if="targetChallenges && characters && items">
    <form class="flex flex-col gap-2 items-start mt-4" @submit="onSubmit">
      <h2>Add new score</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
        <FormTextInput name="userId" label="User ID" type="text" />
        <FormTextInput name="score" label="Score" type="text" />
        <FormTextInput name="time" label="Time in ms" type="text" />
        <FormDatetimeInput name="setAt" label="Date" type="text" />
        <FormSelectInput
          name="ruleId"
          label="Rule"
          :options="targetChallengeOptions"
        />
        <FormSelectInput
          name="characterId"
          label="Character"
          :options="charactersOptions"
        />
        <FormSelectInput
          name="subWeaponId"
          label="Sub-Weapon"
          :options="itemsOptions"
        />
      </div>
      <Button type="submit" severity="secondary" label="Add custom score" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import { z } from "zod";
import { scoreSchema } from "~~/validation/scoreSchema";

const emit = defineEmits<{
  created: [];
}>();

const scoreFormSchema = scoreSchema.extend(
  z.object({
    ruleId: z.number(),
    characterId: z.number(),
    subWeaponId: z.number(),
    setAt: z.date().transform((date) => Math.round(date.getTime() / 1000)),
  }).shape,
);

const { handleSubmit } = useForm({
  validationSchema: scoreFormSchema,
});

const { data: targetChallenges } = await useFetch("/api/target-challenges");
const { data: characters } = await useFetch("/api/characters");
const { data: items } = await useFetch("/api/items");

const targetChallengeOptions = computed(() => {
  return (
    targetChallenges.value?.rulesets.map((rule) => ({
      value: rule.id,
      name: `${rule.name} - ${rule.stageName}`,
    })) || []
  );
});

const charactersOptions = computed(() => {
  return (
    characters.value?.map((item) => ({
      value: item.characterId,
      name: item.name,
    })) || []
  );
});

const itemsOptions = computed(() => {
  return (
    items.value?.map((item) => ({
      value: item.itemId,
      name: `${item.name} - ${item.itemId}`,
    })) || []
  );
});

const onSubmit = handleSubmit(async (values) => {
  await $fetch("/api/manage/scores", {
    method: "POST",
    body: values,
  });
  emit("created");
});
</script>
