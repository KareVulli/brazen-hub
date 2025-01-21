<template>
  <main v-if="data">
    <PageTitle title="Round Team Match" />
    <div class="grid gap-4 mb-4">
      <Panel header="Leaderboard period">
        <span>
          <NuxtTime
            :datetime="$dayjs(data.startedAt).toDate()"
            date-style="medium"
            time-style="short"
          />
        </span>
        -
        <span>
          <NuxtTime
            :datetime="new Date(data.endsAt)"
            date-style="medium"
            time-style="short"
          />
        </span>
        <p
          v-if="$dayjs(data.endsAt) > $dayjs()"
          class="text-green-500 font-bold"
        >
          Closes
          <NuxtTime :datetime="$dayjs(data.endsAt).toDate()" relative />.
        </p>
      </Panel>
    </div>
    <Panel header="Round Team Match Leaderboard">
      <template #header>
        <div class="flex justify-between items-center w-full">
          <span class="p-panel-title">Top 100 players</span>
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText
              v-model="filters['global'].value"
              size="small"
              placeholder="Search for player"
            />
          </IconField>
        </div>
      </template>
      <DataTable
        v-model:filters="filters"
        size="small"
        :value="data.entries"
        :global-filter-fields="['user.name', 'user.userKey', 'wins']"
        sort-field="place"
        :sort-order="1"
      >
        <template #empty>No players found</template>
        <Column field="place" header="Place" sortable />
        <Column field="user" header="User" sortable sort-field="user.name">
          <template #body="slotProps">
            <LinkedUserName :user="slotProps.data.user" />
          </template>
        </Column>
        <Column field="wins" header="Wins" sortable />
      </DataTable>
    </Panel>
  </main>
</template>

<script setup lang="ts">
import { FilterMatchMode } from "@primevue/core/api";

const { data } = await useFetch("/api/rtm");

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  "user.name": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  wins: { value: null, matchMode: FilterMatchMode.EQUALS },
});
</script>
