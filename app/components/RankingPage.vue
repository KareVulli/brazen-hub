<template>
  <Tabs lazy value="rating">
    <TabList>
      <Tab value="rating">Global Rating</Tab>
      <Tab value="kdr">KDR</Tab>
      <Tab value="akr">AKR (RTM)</Tab>
      <Tab value="adr">ADR (RTM)</Tab>
      <Tab value="hpr">AHR (RTM)</Tab>
      <Tab value="wlr">W/L</Tab>
    </TabList>
    <TabPanels>
      <TabPanel value="rating">
        <RankingRatingTab />
      </TabPanel>
      <TabPanel value="kdr">
        <RankingKDRTab />
      </TabPanel>
      <TabPanel value="akr">
        <RankingAKRTab />
      </TabPanel>
      <TabPanel value="adr">
        <RankingADRTab />
      </TabPanel>
      <TabPanel value="hpr">
        <RankingAHRTab />
      </TabPanel>
      <TabPanel value="wlr">
        <RankingWLRTab />
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>

<script setup lang="ts"></script>
