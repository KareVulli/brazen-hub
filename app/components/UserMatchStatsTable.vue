<template>
  <DataTable
    :value="teamUsers"
    size="small"
    :sort-field="sort.field"
    :sort-order="sort.direction"
  >
    <Column
      v-if="showPlacement"
      class="max-w-20"
      field="team"
      header="Placement"
      sortable
      sort-field="team.placement"
      ><template #body="slotProps">
        #{{ slotProps.data.team?.placement || "-" }}
      </template></Column
    >
    <Column field="user" header="User" sortable sort-field="user.name">
      <template #body="slotProps">
        <LinkedUserName :user="slotProps.data.user" />
      </template>
    </Column>
    <Column
      v-if="!compact"
      class="min-w-32"
      field="character"
      header="Character"
      sort-field="character.name"
    >
      <template #body="slotProps">
        <CharacterName
          v-if="slotProps.data.character"
          :character="slotProps.data.character"
        />
        <i v-else class="opacity-50">Unknown</i>
      </template>
    </Column>
    <Column
      v-if="!compact"
      class="min-w-32"
      field="subWeapon"
      header="Sub-weapon"
      sort-field="subWeapon.name"
    >
      <template #body="slotProps">
        <span v-if="slotProps.data.subWeapon">{{
          slotProps.data.subWeapon.name
        }}</span>
        <i v-else class="opacity-50">Unknown</i>
      </template>
    </Column>
    <Column field="kills" header="Kills" sortable />
    <Column field="deaths" header="Deaths" sortable />
    <Column field="stuns" header="Stuns" sortable />
    <Column field="damage" header="Damage" sortable />
  </DataTable>
</template>

<script setup lang="ts">
const props = defineProps<{
  teamUsers: (TeamUserDto & { team?: TeamDto })[] | undefined;
  compact?: boolean;
  showPlacement?: boolean;
  initialSort?: "placement" | "name" | "kills";
}>();

const sortMap = {
  placement: { field: "team.placement", direction: 1 },
  name: { field: "user.name", direction: 1 },
  kills: { field: "kills", direction: -1 },
};

const sort = computed(() => sortMap[props.initialSort || "name"]);
</script>
