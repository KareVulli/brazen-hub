<template>
  <nuxt-plotly
    ref="chart"
    class="min-w-0 bg-[var(--color-green-600)]"
    :data="chartData"
    :config="chartOptions"
    :layout="chartLayout"
  />
</template>

<script setup lang="ts">
import type { NuxtPlotlyConfig, NuxtPlotlyData } from "./NuxtPlotly.vue";

const props = defineProps<{
  stats: UserStatGraphItem[];
  forceXAxisAngle?: number;
}>();

const chart = useTemplateRef("chart");
const isDark = usePreferredDark();
const { $plotly } = useNuxtApp();

const chartOptions = computed(
  (): NuxtPlotlyConfig => ({
    displaylogo: false,
    displayModeBar: false,
    responsive: true,
    scrollZoom: false,
  }),
);

const chartData = computed((): NuxtPlotlyData => {
  return [
    {
      type: "bar",
      x: props.stats.map((item) => item.label),
      y: props.stats.map((item) => item.value),
      text: props.stats.map((item) => item.label),
      textposition: "none",
      hovertemplate: "<b>%{text}:</b> %{y}<extra></extra>",
    },
  ];
});

const documentStyle = getComputedStyle(document.documentElement);
const textColor = ref(documentStyle.getPropertyValue("--p-text-color"));
const surfaceBorder = ref(
  documentStyle.getPropertyValue("--p-content-border-color"),
);

const chartLayout = computed((): Partial<Plotly.Layout> => {
  return {
    dragmode: false,
    modebar: {
      orientation: "h",
      bgcolor: "transparent",
    },
    height: 250,
    minreducedheight: 150,
    paper_bgcolor: "transparent",
    plot_bgcolor: "transparent",
    legend: {
      font: {
        color: textColor.value,
      },
    },
    margin: {
      t: 8,
      b: 16,
      l: 24,
      r: 16,
      pad: 4,
    },
    yaxis: {
      showgrid: true,
      gridcolor: surfaceBorder.value,
    },
    xaxis: {
      automargin: true,
      tickangle: props.forceXAxisAngle ? props.forceXAxisAngle : "auto",
    },
  };
});

watch(isDark, () => {
  const documentStyle = getComputedStyle(document.documentElement);
  textColor.value = documentStyle.getPropertyValue("--p-text-color");
  surfaceBorder.value = documentStyle.getPropertyValue(
    "--p-content-border-color",
  );
});

watch([chartData, chartLayout], () => {
  if (chart.value) {
    $plotly.react(chart.value.$el, chartData.value, chartLayout.value);
  }
});
</script>
