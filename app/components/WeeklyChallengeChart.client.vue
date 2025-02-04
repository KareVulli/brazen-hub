<template>
  <Panel
    header="Ranking over time"
    toggleable
    :collapsed="collapsed"
    @update:collapsed="onCollapseToggled"
  >
    <div class="flex items-center mb-4 gap-2">
      <span>Y Axis:</span
      ><SelectButton
        v-model="chartYData"
        :allow-empty="false"
        :options="[...dataOptions]"
        option-label="optionLabel"
        option-value="optionValue"
        size="small"
      />

      <div class="flex items-center gap-2">
        <ToggleSwitch v-model="showMarkers" />
        <span>Show markers</span>
      </div>
      <span v-if="chartYData !== 'score'" class="text-sm ml-auto"
        >Lower is better</span
      >
    </div>
    <LeaderboardChart
      :players-data="data?.players || []"
      :datapoint="chartYData"
      :show-markers="showMarkers"
    />
  </Panel>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useStorage } from "@vueuse/core";

const collapsed = useStorage<boolean>("setting-weekly-chart-collapsed", true);

const props = defineProps<{
  eventId: number;
}>();

const dataOptions = [
  {
    optionLabel: "Score",
    optionValue: "score",
  },
  {
    optionLabel: "Time",
    optionValue: "time",
  },
  {
    optionLabel: "Place",
    optionValue: "place",
  },
] as const;

type DataOptionValue = (typeof dataOptions)[number]["optionValue"];

const chartYData = ref<DataOptionValue>("score");
const showMarkers = ref<boolean>(false);

const onCollapseToggled = (value: boolean) => {
  collapsed.value = value;
};

const { data } = useFetch(`/api/weekly-graph/${props.eventId}`);
</script>
