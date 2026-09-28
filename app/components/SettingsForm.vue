<template>
  <form class="space-y-4" @submit="onSubmit">
    <FormCheckboxInput name="maintenance" label="Brazen Hub Maintenance" />
    <FormCheckboxInput
      name="matchmakingMaintenance"
      label="Brazen Matchmaking Maintenance"
    />
    <Button type="submit" severity="secondary" label="Save" />
  </form>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import type { DBSettings } from "~~/server/utils/drizzle";
import { settingsSchema } from "~~/validation/settingsSchema";

const props = defineProps<{
  settings: DBSettings;
}>();

const { handleSubmit } = useForm({
  validationSchema: settingsSchema,
  initialValues: props.settings,
});

const onSubmit = handleSubmit(async (values) => {
  await $fetch("/api/manage/settings", {
    method: "PUT",
    body: values,
  });
  await refreshNuxtData(["home-status", "manage-settings"]);
});
</script>
