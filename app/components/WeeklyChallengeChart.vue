<template>
  <Panel header="Ranking over time" toggleable collapsed>
    <div class="flex items-center mb-4 gap-2">
      <span>Y Axis:</span
      ><SelectButton
        v-model="chartYData"
        :options="[...dataOptions]"
        option-label="optionLabel"
        option-value="optionValue"
        size="small"
      />
    </div>
    <div class="flex items-center mb-4 gap-2">
      <ToggleSwitch v-model="omitNoChanges" />
      <span>Show only score changes</span>
    </div>
    <ClientOnly fallback-tag="span" fallback="Loading chart...">
      <Chart
        type="line"
        :data="chartData"
        :options="chartOptions"
        class="h-96"
      />
    </ClientOnly>
  </Panel>
</template>

<script setup lang="ts">
import "chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm";
import { ref } from "vue";
import type { LeaderboardGraphScore } from "~~/server/utils/eventInfo";

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
const omitNoChanges = ref<boolean>(true);

const { data } = useFetch(`/api/weekly-graph/${props.eventId}`);

const chartData = computed(() => {
  if (!data.value) {
    return undefined;
  }
  const result = {
    datasets: data.value.players.map((player) => {
      let scores = player.scores;
      if (omitNoChanges.value) {
        const filteredScores: LeaderboardGraphScore[] = scores.filter(
          (item) => item !== null
        );
        scores = filteredScores.reduce<LeaderboardGraphScore[]>(
          (newArray, item, index) => {
            if (newArray.length === 0) {
              newArray.push(item);
              return newArray;
            }
            if (index === filteredScores.length - 1) {
              newArray.push(item);
              return newArray;
            }
            const previousItem: LeaderboardGraphScore =
              newArray[newArray.length - 1]!;
            if (
              previousItem.score !== item.score ||
              previousItem.place !== item.place ||
              previousItem.time !== item.time
            ) {
              newArray.push(item);
              return newArray;
            }
            return newArray;
          },
          []
        );
      }

      return {
        label: player.name,
        data: scores.map((score) => ({
          x: score?.timestamp,
          y: score?.[chartYData.value],
        })),
        fill: false,
        tension: 0.2,
      };
    }),
  };
  return result;
});
const chartOptions = computed(() => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--p-text-color");
  const textColorSecondary = documentStyle.getPropertyValue(
    "--p-text-muted-color"
  );
  const surfaceBorder = documentStyle.getPropertyValue(
    "--p-content-border-color"
  );

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        title: {
          color: textColor,
          display: true,
          text: "Players",
          font: {
            size: 16,
          },
        },
        labels: {
          color: textColor,
        },
      },
    },
    layout: {},
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
        },
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        reverse: ["place"].includes(chartYData.value),
        type: chartYData.value === "time" ? "time" : "linear",
        time: {
          unit: "second",
          displayFormats: {
            second: "mm:ss.SSS",
          },
        },
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    },
  };
});
</script>
