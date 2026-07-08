<template>
  <DataTable
    v-model:expanded-rows="expandedRows"
    :value="augmentedEntries"
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
    <Column
      field="activeSession.invitationCode"
      header="Invitation Code"
      sortable
    >
      <template #body="slotProps">
        <span v-if="slotProps.data.activeSession">{{
          slotProps.data.activeSession.invitationCode
        }}</span>
        <i v-else class="opacity-70">(no active session)</i>
      </template>
    </Column>
    <Column field="gameRule.name" header="Game Rule" sortable />
    <Column field="stage.name" header="Stage" sortable />
    <Column field="public" header="Public?" sortable />
    <Column field="free" header="Open Teams?" sortable />
    <Column field="createdAt" header="Created At" sortable>
      <template #body="slotProps">
        <ScoreDateColumn :date-timestamp="slotProps.data.createdAt" />
      </template>
    </Column>
    <Column class="text-end">
      <template #body="{ data }">
        <Button
          size="small"
          icon="pi pi-plus"
          severity="success"
          variant="text"
          rounded
          :disabled="!!data.activeSession"
          @click="onOpenRoom(data.id)"
        />
        <Button
          size="small"
          icon="pi pi-play"
          severity="success"
          variant="text"
          rounded
          :disabled="!data.activeSession"
          @click="onStartMatch(data.id)"
        />
        <Button
          size="small"
          icon="pi pi-user-plus"
          severity="info"
          variant="text"
          rounded
          :disabled="!data.activeSession"
          @click="onAddBot(data.id)"
        />
        <Button
          size="small"
          icon="pi pi-user-minus"
          severity="secondary"
          variant="text"
          rounded
          :disabled="!data.activeSession"
          @click="onRemoveBot(data.id)"
        />
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
              Team {{ slotProps.data.team }}
            </template>
          </Column>
        </DataTable>
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
  entries: RoomDto[];
}>();

const emit = defineEmits<{
  closed: [];
  opened: [];
}>();

async function onOpenRoom(id: number) {
  await $fetch(`/api/manage/rooms/${id}/open`, { method: "POST" });
  emit("opened");
}

async function onStartMatch(id: number) {
  await $fetch(`/api/manage/rooms/${id}/start-match`, { method: "POST" });
}

async function onAddBot(id: number) {
  await $fetch(`/api/manage/rooms/${id}/add-bot`, { method: "POST" });
}

async function onRemoveBot(id: number) {
  await $fetch(`/api/manage/rooms/${id}/remove-bot`, { method: "POST" });
}

async function onDelete(id: number) {
  await $fetch(`/api/manage/rooms/${id}/close`, { method: "POST" });
  emit("closed");
}

const augmentedEntries = computed(() => {
  return props.entries.map((room) => {
    const activeSession = room.roomSessions.find(
      (roomSession) => roomSession.active,
    );

    return {
      ...room,
      matches: [...room.matches].sort((a, b) => b.createdAt - a.createdAt),
      activeSession: activeSession || null,
      free: !room.users.length,
    };
  });
});

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
