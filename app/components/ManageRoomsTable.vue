<template>
  <DataTable
    v-model:expanded-rows="expandedRows"
    :value="entries"
    data-key="id"
    sort-field="id"
    :sort-order="1"
    size="small"
  >
    <template #empty>No rooms found</template>
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
          icon="pi pi-play"
          severity="success"
          variant="text"
          rounded
          @click="onStartMatch(data.id)"
        />
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
    <template #expansion="{ data }: { data: Room; index: number }">
      <div class="p-4">
        <DataTable :value="data.users">
          <Column
            class="min-w-48"
            field="user"
            header="User"
            sortable
            sort-field="user.name"
          >
            <template #body="slotProps">
              <LinkedUserName :user="slotProps.data.user" />
            </template>
          </Column>
          <Column field="team" header="Team" sortable>
            <template #body="slotProps">
              Team {{ slotProps.data.team + 1 }}
            </template>
          </Column>
        </DataTable>
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
const props = defineProps<{
  entries: Room[];
}>();

const emit = defineEmits<{
  deleted: [];
}>();

async function onStartMatch(id: number) {
  await $fetch(`/api/manage/rooms/${id}/start-match`, { method: "POST" });
}

async function onDelete(id: number) {
  await $fetch(`/api/manage/rooms/${id}`, { method: "DELETE" });
  emit("deleted");
}

const expandedRows = ref<Record<number, boolean>>({});

const expandAll = () => {
  expandedRows.value = props.entries.reduce<Record<number, boolean>>(
    (acc, p) => ({ ...acc, [p.id]: true }),
    {},
  );
};
const collapseAll = () => {
  expandedRows.value = {};
};
</script>
