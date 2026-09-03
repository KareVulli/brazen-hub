<template>
  <DataTable
    :value="teamUsers"
    size="small"
    :sort-field="sort.field"
    :sort-order="sort.direction"
    :row-class="(data) => (data.disconnectedAt === null ? '' : 'opacity-50')"
    data-key="id"
    :expanded-rows="expandedRows"
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
        <LinkedUserName
          v-tooltip.top="
            slotProps.data.disconnectedAt !== null
              ? 'Disconnected before match end'
              : undefined
          "
          :user="slotProps.data.user"
        />
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
    <template #expansion="{ data }">
      <div class="flex items-center">
        <p class="flex items-baseline">
          Revives: {{ data.revives }}
          <InfoButton
            message="How many times the player revived their teammates"
          />
        </p>
        <!-- <Divider layout="vertical" />
        <p class="flex items-baseline ml-3">
          Skill used: <i class="text-sm opacity-50 ml-1"> Coming soon!</i>
          <InfoButton message="How many times the player used their skill" />
        </p>
        <Divider layout="vertical" />
        <p class="flex items-baseline ml-3">
          Ultimate used: <i class="text-sm opacity-50 ml-1"> Coming soon!</i>
          <InfoButton message="How many times the player used their ultimate" />
        </p> -->
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    teamUsers?: (TeamUserDto & { team?: TeamDto })[];
    compact?: boolean;
    showPlacement?: boolean;
    initialSort?: "placement" | "name" | "kills";
    showDetails?: boolean;
  }>(),
  {
    teamUsers: () => [],
    initialSort: "name",
    showDetails: false,
  },
);

const sortMap = {
  placement: { field: "team.placement", direction: 1 },
  name: { field: "user.name", direction: 1 },
  kills: { field: "kills", direction: -1 },
};

const sort = computed(() => sortMap[props.initialSort || "name"]);

const expandedRows = computed<Record<number, boolean>>(() => {
  if (props.showDetails) {
    return props.teamUsers.reduce<Record<number, boolean>>(
      (acc, p) => ({ ...acc, [p.id]: true }),
      {},
    );
  } else {
    return [];
  }
});
</script>
