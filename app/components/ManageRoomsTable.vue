<template>
  <DataTable :value="entries" sort-field="id" :sort-order="1" size="small">
    <template #empty>No rooms found</template>
    <Column field="id" header="ID" sortable sort-field="id" />
    <Column field="matchId" header="Room ID" sortable sort-field="id" />
    <Column field="invitationCode" header="Invitation Code" sortable />
    <Column field="gameRule.name" header="Game Rule" sortable />
    <Column field="stage.name" header="Stage" sortable />
    <Column field="public" header="Public?" sortable />
    <Column field="createdAt" header="Created At" sortable>
      <template #body="slotProps">
        <ScoreDateColumn :date-timestamp="slotProps.data.createdAt" />
      </template>
    </Column>
    <Column class="text-end">
      <template #body="{ data }">
        <Button
          size="small"
          icon="pi pi-trash"
          severity="danger"
          variant="text"
          rounded
          @click="onDelete(data.id)"
        />
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
defineProps<{
  entries: Room[];
}>();

const emit = defineEmits<{
  deleted: [];
}>();

async function onDelete(id: number) {
  await $fetch(`/api/manage/rooms/${id}`, { method: "DELETE" });
  emit("deleted");
}
</script>
