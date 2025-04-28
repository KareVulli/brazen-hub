<template>
  <PageTitle title="Characters" />
  <p class="mb-4">
    Main stats of all characters in the current version of the game.
  </p>
  <DataTable :value="characters" sort-field="id" :sort-order="1" size="small">
    <Column field="displayName" header="Name" sortable />
    <Column field="hp" header="HP" sortable />
    <Column field="punchDamage" header="Punch dmg" sortable />
    <Column field="boostPunchDamage" header="Boost punch dmg" sortable />
    <Column field="passivePunchDamage" header="Passive punch dmg" sortable />
    <Column field="boostMax" header="Boosts" sortable>
      <template #body="slotProps">
        <span class="whitespace-nowrap"
          >{{ slotProps.data.boostMax * 2 }}
          <small>( {{ slotProps.data.boostMax }} per hand )</small></span
        >
      </template>
    </Column>
    <Column field="boostRecovery" header="Boost recovery" sortable>
      <template #body="slotProps">
        <span class="whitespace-nowrap">
          {{ slotProps.data.boostRecovery }} per second
        </span>
      </template>
    </Column>
    <Column field="skillRecastTime" header="Skill cooldown" sortable>
      <template #body="slotProps">
        <span class="whitespace-nowrap">
          {{ slotProps.data.skillRecastTime }} seconds
        </span>
      </template>
    </Column>
    <Column field="ultimatePoints" header="Ultimate cooldown" sortable />
    <Column
      field="ultimatePointsAttackMultiplier"
      header="Ult. Attack Mult."
      sortable
    />
    <Column
      field="ultimatePointsDamageMultiplier"
      header="Ult. Damage Mult."
      sortable
    />
  </DataTable>
</template>

<script setup lang="ts">
import type { DetailedCharacter } from "~~/server/utils/character";

defineProps<{
  characters: DetailedCharacter[];
}>();
</script>
