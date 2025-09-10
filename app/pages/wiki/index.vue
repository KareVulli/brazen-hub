<template>
  <div>
    <PageTitle title="Brazen Blaze wiki" />
    <p class="mb-4">
      <Message severity="info">
        This wiki is in very early development and there is not much information
        here yet. Most existing pages have incomplete/missing information.
        <br />Feel free to contribute by creating a pull request in
        <AppLink to="https://github.com/KareVulli/brazen-hub" target="_blank"
          >https://github.com/KareVulli/brazen-hub</AppLink
        >.
      </Message>
    </p>
    <div class="grid md:grid-cols-3 gap-4">
      <WikiCategory title="Characters (Not ready)" :items="characterItems" />
      <WikiCategory title="Maps (Not ready)" :items="mapItems" />
      <WikiCategory title="Items (Not ready)" :items="itemItems" />
      <WikiCategory title="Misc" :items="miscItems" />
    </div>
  </div>
</template>

<script setup lang="ts">
import WikiCategory from "~/components/WikiCategory.vue";

const characterItems = ref([
  {
    label: "Riot",
    route: "/wiki/characters/riot",
  },
  {
    label: "Legacy",
    route: "/wiki/characters/legacy",
  },
  {
    label: "Skybolt",
    route: "/wiki/wip",
  },
]);

const mapItems = ref([
  {
    label: "New York City",
    route: "/wiki/wip",
  },
]);

const itemItems = ref([
  {
    label: "Handgun",
    route: "/wiki/items/handgun",
  },
  {
    label: "Combat Knife",
    route: "/wiki/items/combat-knife",
  },
  {
    label: "Electric Knuckles",
    route: "/wiki/items/electric-knuckles",
  },
]);

const miscItems = ref([
  {
    label: "Listening to Audio files from the game",
    route: "/wiki/misc/getting-ost-from-the-game",
  },
]);
</script>
