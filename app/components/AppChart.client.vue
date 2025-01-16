<template>
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
</template>

<script setup lang="ts">
import type { Chart } from "chart.js";
import "chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm";
import zoomPlugin from "chartjs-plugin-zoom";

const props = defineProps<{
  chartData: object;
  scales: object;
}>();

const chart = useTemplateRef("chart");

const chartOptions = computed(() => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--p-text-color");

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
    scales: props.scales,
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
