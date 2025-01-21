<template>
  <PageTitle title="Target Challenges" />
  <div class="flex flex-col lg:flex-row gap-4">
    <SideMenu :items="items" />
    <div class="flex-grow">
      <TargetChallenge v-if="selectedRuleset" :ruleset="selectedRuleset" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RuleDto } from "~~/server/utils/rule";

const props = defineProps<{
  rulesets: RuleDto[];
  rulesetId?: number;
}>();

const selectedRuleset = computed(() => {
  if (props.rulesetId !== undefined) {
    const eventId = props.rulesetId;
    return props.rulesets.find((event) => event.id === eventId);
  } else if (props.rulesets.length) {
    return props.rulesets[0];
  } else {
    return null;
  }
});

const items = computed(() =>
  props.rulesets.map((ruleset) => {
    const rulesetName = `${ruleset.name} - ${ruleset.stageName}`;
    return {
      label: rulesetName,
      route: `/target-challenges/${ruleset.id}`,
    };
  })
);
</script>
