<template>
  <Tabs v-model:value="tab">
    <TabList>
      <Tab value="rating">Global Rating</Tab>
      <Tab value="kdr">KDR</Tab>
      <Tab value="akr">AKR (RTM)</Tab>
      <Tab value="adr">ADR (RTM)</Tab>
      <Tab value="ahr">AHR (RTM)</Tab>
      <Tab value="wlr">W/L</Tab>
    </TabList>
    <TabPanels>
      <TabPanel v-if="tab === 'rating'" value="rating">
        <RankingRatingTab />
      </TabPanel>
      <TabPanel v-if="tab === 'kdr'" value="kdr">
        <RankingKDRTab />
      </TabPanel>
      <TabPanel v-if="tab === 'akr'" value="akr">
        <RankingAKRTab />
      </TabPanel>
      <TabPanel v-if="tab === 'adr'" value="adr">
        <RankingADRTab />
      </TabPanel>
      <TabPanel v-if="tab === 'ahr'" value="ahr">
        <RankingAHRTab />
      </TabPanel>
      <TabPanel v-if="tab === 'wlr'" value="wlr">
        <RankingWLRTab />
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>

<script setup lang="ts">
useHead({
  title: "Ranking",
});

const route = useRoute();

const tab = computed({
  get() {
    return route.params.tab || "rating";
  },
  set(newValue: string) {
    navigateTo(`/ranking/${newValue}`);
  },
});
</script>
