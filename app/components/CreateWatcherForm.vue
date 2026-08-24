<template>
  <form class="space-y-4" @submit="onSubmit">
    <h2>Invite StatsBot to your custom room by entering the room code:</h2>
    <div class="flex flex-row gap-2 items-start">
      <FormTextInput
        name="code"
        label=""
        placeholder="Room code"
        type="text"
        dense
      />
      <Button
        class="flex-shrink-0"
        type="submit"
        severity="primary"
        label="Add StatsBot!"
        :loading="loading"
        :disabled="!values.code"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import { watcherSchema } from "~~/validation/watcherSchema";
import { FetchError } from "ofetch";

const toast = useToast();

const emit = defineEmits<{
  created: [];
}>();
const loading = ref<boolean>(false);

const { handleSubmit, values } = useForm({
  validationSchema: watcherSchema,
});

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  try {
    await $fetch("/api/watchers", {
      method: "POST",
      body: values,
    });
    emit("created");
  } catch (error) {
    if (error instanceof FetchError && error.statusCode === 400) {
      toast.add({
        severity: "error",
        summary: "Error creating watcher",
        detail: error.data.message,
        life: 3000,
      });
    } else {
      toast.add({
        severity: "error",
        summary: "Error creating watcher",
        detail: error instanceof Error ? error.message : String(error),
        life: 3000,
      });
    }

    return;
  } finally {
    loading.value = false;
  }
});
</script>
