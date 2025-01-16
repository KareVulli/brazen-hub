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
    <ButtonGroup>
      <Button
        label="Reset zoom"
        size="small"
        severity="secondary"
        @click="resetChartZoom"
      />
      <Button
        label="Toggle points"
        size="small"
        severity="secondary"
        @click="togglePoints"
      />
    </ButtonGroup>
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
    elements: {
      point: {
        pointStyle: false,
      },
    },
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
function getChart(): Chart | null {
  return chart.value?.getChart() || null;
}
function resetChartZoom() {
  chart.value?.getChart().resetZoom();
}
function setPlayersVisibility(show: boolean) {
  const chartInstance = getChart();
  if (chartInstance) {
    chartInstance.data.datasets.forEach((dataset) => (dataset.hidden = !show));
    chartInstance.update();
  }
}
function togglePoints() {
  const chartInstance = getChart();
  if (chartInstance?.options.elements?.point) {
    const oldStyle = chartInstance.options.elements?.point?.pointStyle;
    chartInstance.options.elements.point.pointStyle = oldStyle
      ? false
      : "circle";
    chartInstance.update();
  }
}
</script>
