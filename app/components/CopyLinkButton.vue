<template>
  <Button
    icon="pi pi-link"
    :label="label"
    variant="text"
    size="small"
    @click="onClick"
  />
</template>

<script setup lang="ts">
const props = defineProps<{ content: string; label: string }>();
const { copy } = useClipboard();
const toast = useToast();

async function onClick() {
  await copy(props.content);
  toast.add({
    summary: "Link copied",
    life: 1000,
  });
}
</script>
