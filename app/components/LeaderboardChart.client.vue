<template>
  <nuxt-plotly
    ref="chart"
    :data="chartData"
    :config="chartOptions"
    :layout="chartLayout"
  />
</template>

<script setup lang="ts">
import type { NuxtPlotlyConfig, NuxtPlotlyData } from "nuxt-plotly";
import type * as Plotly from "plotly.js-dist-min";
import type { LeaderboardGraphPlayer } from "~~/server/utils/eventInfo";

const props = defineProps<{
  playersData: LeaderboardGraphPlayer[];
  datapoint: "score" | "place" | "time";
  showMarkers?: boolean;
}>();

const chart = useTemplateRef("chart");
const isDark = usePreferredDark();
const { $plotly }: { $plotly: typeof Plotly } = useNuxtApp();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const chartOptions: any = computed(
  (): NuxtPlotlyConfig => ({
    displaylogo: false,
    displayModeBar: true,
    responsive: true,
    modeBarButtonsToRemove: ["lasso2d", "select2d", "toImage"],
  })
);

const chartData = computed((): NuxtPlotlyData => {
  return props.playersData.map((player, index) => {
    const scores = player.scores.filter((score) => score != null);

    return {
      name: player.name,
      x: scores.map((score) => score.timestamp),
      y: scores.map((score) => score[props.datapoint]),
      mode: props.showMarkers ? "lines+markers" : "lines",
      visible: index >= 5 ? "legendonly" : true,
    };
  });
});

const documentStyle = getComputedStyle(document.documentElement);
const textColor = ref(documentStyle.getPropertyValue("--p-text-color"));
const surfaceBorder = ref(
  documentStyle.getPropertyValue("--p-content-border-color")
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const chartLayout: any = computed((): Partial<Plotly.Layout> => {
  return {
    modebar: {
      orientation: "h",
      bgcolor: "transparent",
    },
    paper_bgcolor: "transparent",
    plot_bgcolor: "transparent",
    legend: {
      font: {
        color: textColor.value,
      },
      uirevision: 1,
    },
    margin: {
      t: 32,
      b: 48,
      l: 64,
      r: 16,
    },
    yaxis: {
      showgrid: true,
      gridcolor: surfaceBorder.value,
      type: props.datapoint === "time" ? "date" : "linear",
      autorange: props.datapoint === "place" ? "reversed" : true,
      tickformat: props.datapoint === "time" ? "%M:%S.%L" : "d",
    },
    xaxis: {
      showgrid: false,
      type: "date",
      hoverformat: "%Y-%m-%d %H:%M",
      ticklabelmode: "period",
      tickformat: "%Y-%m-%d",
      tickformatstops: [
        {
          dtickrange: [null, 60000],
          value: "%H:%M:%S",
        },
        {
          dtickrange: [60000, 86400000],
          value: "%b %d %H:%M",
        },
        {
          dtickrange: [86400000, null],
          value: "%Y-%m-%d",
        },
      ],
    },
  };
});

watch(isDark, () => {
  const documentStyle = getComputedStyle(document.documentElement);
  textColor.value = documentStyle.getPropertyValue("--p-text-color");
  surfaceBorder.value = documentStyle.getPropertyValue(
    "--p-content-border-color"
  );
});

watch([chartData, chartLayout], () => {
  if (chart.value) {
    $plotly.react(chart.value.$el, chartData.value, chartLayout.value);
  }
});
</script>

<style>
.js-plotly-plot .plotly .modebar svg {
  display: inline;
}
</style>
