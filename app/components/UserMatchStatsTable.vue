<template>
  <DataTable :value="teamUsers" size="small">
    <Column
      class="min-w-40"
      field="user"
      header="User"
      sortable
      sort-field="user.name"
    >
      <template #body="slotProps">
        <LinkedUserName :user="slotProps.data.user" />
      </template>
    </Column>
    <Column
      v-if="!compact"
      class="min-w-32"
      field="character"
      header="Character"
      sortable
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
      header="Sub-Weapon"
      sortable
      sort-field="subWeapon.name"
    >
      <template #body="slotProps">
        <span v-if="slotProps.data.subWeapon">{{
          slotProps.data.subWeapon.name
        }}</span>
        <i v-else class="opacity-50">Unknown</i>
      </template>
    </Column>
    <Column field="kills" header="Kills" />
    <Column field="deaths" header="Deaths" />
    <Column field="stuns" header="Stuns" />
    <Column field="damage" header="Damage" />
  </DataTable>
</template>

<script setup lang="ts">
defineProps<{
  teamUsers: TeamUserDto[] | undefined;
  compact?: boolean;
}>();
</script>
