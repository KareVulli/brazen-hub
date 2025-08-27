<template>
  <div class="grid grid-cols-2">
    <div>
      <h3>General information</h3>
      <ul v-if="data">
        <li>HP: {{ data.hp }}</li>
        <li>
          Punch damage: {{ data.punchDamage }} (normal),
          {{ data.boostPunchDamage }} (boost),
          {{ data.passivePunchDamage }} (passive)
        </li>
        <li>
          Boosts: {{ data.boostMax * 2 }} ( {{ data.boostMax }} per hand ),
          recovering at {{ data.boostRecovery }} boosts per second
        </li>
      </ul>
      <slot />
    </div>
    <div class="not-prose">
      <img
        v-if="data"
        :src="`/img/characters/character-${data.characterId}.png`"
        :alt="data.name"
        class="mx-auto w-full max-w-sm h-auto"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  characterId: number;
}>();

const { data } = await useFetch(`/api/characters/${props.characterId}`);
</script>
