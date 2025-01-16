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
        ref="chart"
        type="line"
        :data="chartData"
        :options="chartOptions"
        :plugins="[zoomPlugin]"
        class="h-96"
      />
      <div class="flex gap-2 mt-2">
        <ButtonGroup>
          <Button
            label="Select all players"
            size="small"
            severity="secondary"
            @click="setPlayersVisibility(true)"
          />
          <Button
            label="Deselect all players"
            size="small"
            severity="secondary"
            @click="setPlayersVisibility(false)"
          />
        </ButtonGroup>
        <Button
          label="Reset zoom"
          size="small"
          severity="secondary"
          @click="resetChartZoom"
        />
      </div>
    </ClientOnly>
  </Panel>
</template>

<script setup lang="ts">
import type { Chart } from "chart.js";
import { ref } from "vue";
import type { LeaderboardGraphScore } from "~~/server/utils/eventInfo";
import "chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm";
import zoomPlugin from "chartjs-plugin-zoom";

const props = defineProps<{
  eventId: number;
}>();

const chart = useTemplateRef("chart");

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
        position: "bottom",
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
      zoom: {
        limits: {
          x: { min: "original", max: "original" },
          y: { min: "original", max: "original" },
        },
        zoom: {
          drag: {
            enabled: true,
          },
          wheel: {
            enabled: true,
          },
          mode: "xy",
        },
      },
    },
    layout: {},
    transitions: {
      zoom: {
        animation: {
          duration: 200,
          easing: "easeOutCubic",
        },
      },
    },
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

function resetChartZoom() {
  chart.value?.getChart().resetZoom();
}
function setPlayersVisibility(show: boolean) {
  if (chart.value) {
    const chartInstance: Chart = chart.value.getChart();
    chartInstance.data.datasets.forEach((dataset) => (dataset.hidden = !show));
    chartInstance.update();
  }
}
</script>
