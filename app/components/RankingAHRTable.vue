<template>
  <DataTable :value="data" sort-field="place" :sort-order="1">
    <template #empty>No stats found</template>
    <Column class="w-24" field="rank" header="Rank" sortable />
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
    <Column class="min-w-28" field="statPerRound" header="AHR" sortable>
      <template #body="slotProps">
        {{ Math.round(slotProps.data.statPerRound) }}
      </template>
    </Column>
    <Column
      field="totalHealingReceived"
      header="Total Healing Received"
      sortable
    />
    <Column field="matches" header="Matches" sortable />
  </DataTable>
</template>

<script setup lang="ts">
const props = defineProps<{
  stats: UserHealingStat[];
}>();

const data = computed(() => {
  return props.stats.map((item, index) => ({
    rank: index + 1,
    ...item,
  }));
});
</script>
