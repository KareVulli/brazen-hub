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
  <h2 class="mt-4 mb-2">Definitions</h2>
  <ul class="text-sm">
    <li>
      <span class="font-semibold">Punch dmg (Punch damage)</span> - Punches
      without boost
    </li>
    <li>
      <span class="font-semibold">Boost punch dmg (Boost punch damage)</span> -
      Punches with boost
    </li>
    <li class="mb-2">
      <span class="font-semibold"
        >Passive punch dmg (Passive punch damage)</span
      >
      - Damage when you collide with another player with high speed. Only when
      Boost punch is set to "Auto" in settings.
    </li>
    <li>
      <span class="font-semibold">Ultimate cooldown</span> - Number of points
      you need to collect to charge up the ultimate gauge.
    </li>
    <li>
      <span class="font-semibold"
        >Ult. Attack Mult. (Ultimate Attack Multiplier)</span
      >
      - This multiplier is used when converting the damage you give to an enemy
      to the ultimate points you get.
    </li>
    <li>
      <span class="font-semibold"
        >Ult. Damage Mult. (Ultimate Damage Multiplier)</span
      >
      - This multiplier is used when converting the damage you take to the
      ultimate points you get as a result of the damage.
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { DetailedCharacter } from "~~/server/utils/character";

defineProps<{
  characters: DetailedCharacter[];
}>();
</script>
