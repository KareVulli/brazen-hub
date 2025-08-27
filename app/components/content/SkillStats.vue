<template>
  <div v-if="data">
    <h3 id="skill">
      <a href="#skill">Skill - {{ data.skillName }}</a>
    </h3>
    <blockquote>
      <q>{{ data.skillDescription }}</q>
    </blockquote>
    <slot />
    <ul>
      <li v-for="(item, index) in listItems" :key="index">{{ item }}</li>
      <li>Cooldown: {{ data.skillRecastTime }} seconds</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  characterId: number;
  listItems: string[];
}>();

const { data } = await useFetch(`/api/characters/${props.characterId}`);
</script>
