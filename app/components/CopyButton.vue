<template>
  <Button
    icon="pi pi-copy"
    variant="text"
    rounded
    aria-label="Copy"
    size="small"
    @click="onClick"
  />
</template>

<script setup lang="ts">
const props = defineProps<{ content: string }>();
const { copy } = useClipboard();
const toast = useToast();

async function onClick() {
  await copy(props.content);
  toast.add({
    summary: "Copied",
    life: 1000,
  });
}
</script>
