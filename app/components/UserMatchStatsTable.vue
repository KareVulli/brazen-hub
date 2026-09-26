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
    <Column field="kills" sortable>
      <template #header>
        <span class="hidden lg:inline font-semibold">Kills</span>
        <span class="inline lg:hidden font-semibold">K</span>
      </template>
    </Column>
    <Column field="deaths" sortable>
      <template #header>
        <span class="hidden lg:inline font-semibold">Deaths</span>
        <span class="inline lg:hidden font-semibold">D</span>
      </template>
    </Column>
    <Column field="stuns" sortable>
      <template #header>
        <span class="hidden lg:inline font-semibold">Stuns</span>
        <span class="inline lg:hidden font-semibold">S</span>
      </template>
    </Column>
    <Column field="damage" sortable>
      <template #header>
        <span class="hidden lg:inline font-semibold">Damage</span>
        <span class="inline lg:hidden font-semibold">Dmg</span>
      </template>
    </Column>
    <template #expansion="{ data }">
      <div class="lg:flex lg:items-center">
        <p class="flex items-baseline">
          Revives: {{ data.revives }}
          <InfoButton
            message="How many times the player revived their teammates"
          />
        </p>
        <Divider class="hidden lg:block" layout="vertical" />
        <p class="flex items-baseline lg:ml-3">
          Skill used: {{ data.skill }}
          <InfoButton message="How many times the player used their skill" />
        </p>
        <Divider class="hidden lg:block" layout="vertical" />
        <p class="flex items-baseline lg:ml-3">
          Ultimate used: {{ data.ultimate }}
          <InfoButton message="How many times the player used their ultimate" />
        </p>
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
