<template>
  <Panel
    header="Recent recorded matches"
    :pt="{ contentWrapper: { class: 'min-w-0' } }"
  >
    <template #icons>
      <AppLink class="text-sm" :to="{ path: `/users/${userKey}/matches` }">
        See all
      </AppLink>
    </template>
    <DataView :value="matches" data-key="id">
      <template #empty>No custom matches.</template>
      <template #list="slotProps">
        <div class="flex flex-col">
          <div
            v-for="(match, index) in slotProps.items"
            :key="match.id"
            class="flex"
            :class="{
              'border-t border-surface-200 dark:border-surface-700 pt-4':
                index !== 0,
              'pb-4': index !== slotProps.items.length - 1,
            }"
          >
            <CompactMatchItem :match="match" />
          </div>
        </div>
      </template>
    </DataView>
  </Panel>
</template>

<script setup lang="ts">
defineProps<{
  userKey: string;
  matches: MatchDto[];
}>();
</script>
