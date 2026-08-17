<script setup lang="ts">
import Plotly from "plotly.js-dist-min";
import { onBeforeUnmount, onMounted, watch } from "vue";

export type NuxtPlotlyData = Array<Plotly.Data>;
export type NuxtPlotlyConfig = Partial<Plotly.Config>;
export type NuxtPlotlyLayout = Partial<Plotly.Layout>;
export type NuxtPlotlyHTMLElement = Partial<Plotly.PlotlyHTMLElement>;

const props = defineProps<{
  data: NuxtPlotlyData;
  config?: NuxtPlotlyConfig;
  layout?: NuxtPlotlyLayout;
}>();

const emit = defineEmits<{
  "on-ready": [element: NuxtPlotlyHTMLElement];
}>();

const plotlyId = `plotly-${crypto.randomUUID()}`;
let resizeObserver: ResizeObserver;
let timeOutFunctionId: ReturnType<typeof setTimeout>;

const setGraph = async () => {
  const el = await Plotly.newPlot(
    plotlyId,
    props.data,
    props.layout,
    props.config,
  );
  emit("on-ready", el);
};

const setResizeObserver = () => {
  resizeObserver = new ResizeObserver(() => {
    clearTimeout(timeOutFunctionId);
    timeOutFunctionId = setTimeout(() => setGraph(), 100);
  });
  const plotlyElm = document.getElementById(plotlyId);
  if (plotlyElm) resizeObserver.observe(plotlyElm);
};

onMounted(() => {
  setGraph();
  setResizeObserver();
});

watch(
  () => [props.data, props.layout, props.config],
  () => setGraph(),
  { deep: true },
);

onBeforeUnmount(() => resizeObserver?.disconnect());
</script>

<template>
  <div :id="plotlyId" />
</template>
