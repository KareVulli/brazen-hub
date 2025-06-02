<template>
  <div v-if="targetChallenges && characters && items">
    <Form
      :resolver="resolver"
      class="flex flex-col gap-2 items-start"
      @submit="onFormSubmit"
    >
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
          :options="characters"
        />
        <FormSelectInput
          name="subWeaponId"
          label="Sub-Weapon"
          :options="itemsOptions"
        />
      </div>
      <Button type="submit" severity="secondary" label="Add custom score" />
    </Form>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { scoreSchema } from "~~/validation/scoreSchema";
import { z } from "zod";

const emit = defineEmits<{
  (e: "created"): void;
}>();

const scoreFormSchema = scoreSchema.merge(
  z.object({
    ruleId: z.object({ id: z.number() }).transform((rule) => rule.id),
    characterId: z
      .object({ characterId: z.number() })
      .transform((character) => character.characterId),
    subWeaponId: z.object({ id: z.number() }).transform((item) => item.id),
    setAt: z.date().transform((date) => Math.round(date.getTime() / 1000)),
  })
);

const { data: targetChallenges } = await useFetch("/api/target-challenges");
const { data: characters } = await useFetch("/api/characters");
const { data: items } = await useFetch("/api/items");

const targetChallengeOptions = computed(() => {
  return (
    targetChallenges.value?.rulesets.map((rule) => ({
      id: rule.id,
      name: `${rule.name} - ${rule.stageName}`,
    })) || []
  );
});

const itemsOptions = computed(() => {
  return (
    items.value?.map((item) => ({
      id: item.itemId,
      name: `${item.name} - ${item.itemId}`,
    })) || []
  );
});

const resolver = zodResolver(scoreFormSchema);

const onFormSubmit = async ({ valid, values }: FormSubmitEvent) => {
  console.log(valid, values);
  if (valid) {
    await $fetch("/api/manage/scores", {
      method: "POST",
      body: values,
    });
    emit("created");
  }
};
</script>
