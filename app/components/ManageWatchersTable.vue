<template>
  <DataTable
    v-model:expanded-rows="expandedRows"
    :value="entries"
    data-key="roomSession.id"
    sort-field="roomSession.id"
    :sort-order="1"
    size="small"
  >
    <template #empty>No watcher sessions found</template>
    <template #header>
      <div class="flex flex-wrap justify-end gap-2">
        <Button
          variant="text"
          size="small"
          icon="pi pi-plus"
          label="Expand All"
          @click="expandAll"
        />
        <Button
          variant="text"
          size="small"
          icon="pi pi-minus"
          label="Collapse All"
          @click="collapseAll"
        />
      </div>
    </template>
    <Column expander />
    <Column
      field="roomSession.id"
      header="ID"
      sortable
      sort-field="roomSession.id"
    />
    <Column
      field="roomSession.invitationCode"
      header="Invitation Code"
      sortable
    />
    <Column field="roomSession.active" header="Active?" sortable />
    <Column field="roomSession.createdAt" header="Created At" sortable>
      <template #body="slotProps">
        <ScoreDateColumn
          :date-timestamp="slotProps.data.roomSession.createdAt"
        />
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
          :disabled="!data.activeSession"
          @click="onDelete(data.id)"
        />
      </template>
    </Column>
    <template #expansion="{ data }: { data: RoomDto; index: number }">
      <div class="p-4 space-y-2">
        <p>Match history</p>
        <SideMenu
          :items="
            data.matches.map((match) => ({
              label: `Match #${match.id}`,
              url: `/matches/${match.id}`,
            }))
          "
        />
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
const props = defineProps<{
  entries: WatcherSessionDto[];
}>();

const emit = defineEmits<{
  closed: [];
}>();

async function onDelete(_id: number) {
  // await $fetch(`/api/manage/rooms/${id}/close`, { method: "POST" });
  emit("closed");
}

const expandedRows = ref<Record<number, boolean>>({});

const expandAll = () => {
  expandedRows.value = props.entries.reduce<Record<number, boolean>>(
    (acc, p) => ({ ...acc, [p.roomSession.id]: true }),
    {},
  );
};
const collapseAll = () => {
  expandedRows.value = {};
};
</script>
