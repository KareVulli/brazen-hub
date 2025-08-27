<template>
  <div v-if="data">
    <h3 id="ultimate">
      <a href="#ultimate">Ultimate - {{ data.ultimateName }}</a>
    </h3>
    <blockquote>
      <q>{{ data.ultimateDescription }}</q>
    </blockquote>
    <slot />
    <ul>
      <li v-for="(item, index) in listItems" :key="index">{{ item }}</li>
      <li>Points needed: {{ data.ultimatePoints }}</li>
      <li v-if="data.ultimateRange > 0">
        Range: {{ data.ultimateRange }} units
      </li>
      <li>
        Ultimate recovery multipliers:
        {{ data.ultimatePointsAttackMultiplier }} (attack),
        {{ data.ultimatePointsDamageMultiplier }} (damage)
      </li>
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
