<template>
  <span class="cursor-pointer font-semibold hover:underline" @click="toggle">
    {{ character.displayName }}
  </span>
  <Popover ref="op">
    <ul>
      <li>Character: {{ character.displayName }}</li>
      <li>HP: {{ character.hp }}</li>
      <li>Skill cooldown: {{ character.skillRecastTime }} seconds</li>
      <li>Ultimate cooldown: {{ character.ultimatePoints }} points</li>
      <li>Boosts per hand: {{ character.boostMax }}</li>
      <li>Boosts recovery speed: {{ character.boostRecovery }} per second</li>
    </ul>
  </Popover>
</template>

<script setup lang="ts">
import type { Character } from "~~/server/utils/character";

defineProps<{
  character: Character;
}>();

const op = ref();

const toggle = (event: MouseEvent) => {
  op.value.toggle(event);
};
</script>
