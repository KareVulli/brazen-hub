<template>
  <form class="flex flex-col gap-2 items-start mt-4" @submit="onSubmit">
    <h2>Add watcher to custom match</h2>
    <div class="space-y-2 w-full">
      <FormTextInput name="code" label="Room code" type="text" />
      <Button type="submit" severity="secondary" label="Add watcher" />
    </div>
  </form>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import { watcherSchema } from "~~/validation/watcherSchema";

const toast = useToast();

const emit = defineEmits<{
  created: [];
}>();

const { handleSubmit } = useForm({
  validationSchema: watcherSchema,
});

const onSubmit = handleSubmit(async (values) => {
  try {
    await $fetch("/api/manage/watchers", {
      method: "POST",
      body: values,
    });
    emit("created");
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error creating watcher",
      detail: error instanceof Error ? error.message : String(error),
      life: 3000,
    });
    return;
  }
});
</script>
