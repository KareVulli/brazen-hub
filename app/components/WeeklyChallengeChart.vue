<template>
  <Panel header="Ranking over time">
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
import { onMounted, ref } from "vue";

const props = defineProps<{
  eventId: number;
}>();

const { data } = useFetch(`/api/weekly-graph/${props.eventId}`);

onMounted(() => {
  chartOptions.value = setChartOptions();
});

const chartData = computed(() => {
  const documentStyle = getComputedStyle(document.documentElement);

  if (!data.value) {
    return undefined;
  }
  return {
    labels: data.value.timestamps,
    datasets: data.value.players.map((player) => ({
      label: player.name,
      data: player.scores.map((score) => score?.place || null),
      fill: false,
      borderColor: documentStyle.getPropertyValue("--p-cyan-500"),
      tension: 0.2,
    })),
  };
});
const chartOptions = ref();

const setChartOptions = () => {
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
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    },
  };
};
</script>
