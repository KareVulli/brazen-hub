<template>
  <PageTitle title="Custom Matches" />
  <CreateWatcher />
  <hr class="my-4 border-surface-200 dark:border-surface-700" />
  <PageTitle title="Match history">
    <template #actions>
      <Button
        label="Refresh"
        icon="pi pi-refresh"
        size="small"
        severity="secondary"
        @click="refresh"
      />
    </template>
  </PageTitle>

  <ClientOnly>
    <Panel
      v-model:collapsed="collapsed"
      class="mb-4"
      header="Filters"
      toggleable
    >
      <form class="flex flex-col gap-2" @submit="onSubmit">
        <FormPlayerInput name="players" label="Players" type="text" multiple />
        <div class="grid gap-2 sm:grid-cols-2">
          <FormSelectInput
            name="gameRuleId"
            label="Game rule"
            :options="gameRuleOptions"
          />
          <FormSelectInput
            name="stageId"
            label="Stage"
            :options="stageOptions"
          />
        </div>
      </form>
    </Panel>
  </ClientOnly>

  <MatchList
    :players="players"
    :game-rule-id="gameRuleId"
    :stage-id="stageId"
    resetable-filters
    @reset-filters="reset"
  />
</template>

<script setup lang="ts">
import { useQueryClient } from "@tanstack/vue-query";
import { useForm } from "vee-validate";
import { useStorage } from "@vueuse/core";
import z from "zod";
import { MULTIPLAYER_GAMERULES, MULTIPLAYER_STAGES } from "~~/shared/constants";

const collapsed = useStorage<boolean>("setting-match-filters-collapsed", true);
const queryClient = useQueryClient();

const { data: stages } = await useFetch("/api/stages");
const { data: gameRules } = await useFetch("/api/game-rules");

const stageOptions = computed(() => {
  return (stages.value || [])
    .filter((item) => MULTIPLAYER_STAGES.includes(item.id))
    .map((item) => ({
      value: item.id,
      name: item.name,
    }));
});
const gameRuleOptions = computed(() => {
  return (gameRules.value || [])
    .filter((item) => MULTIPLAYER_GAMERULES.includes(item.id))
    .map((item) => ({
      value: item.id,
      name: item.name,
    }));
});

const players = useRouteQueryArray("players", null);
const gameRuleId = useRouteQueryInteger("gameRuleId");
const stageId = useRouteQueryInteger("stageId");

async function refresh() {
  queryClient.resetQueries(
    { queryKey: ["infiniteMatches"] },
    { cancelRefetch: false },
  );
}

const schema = z.object({
  gameRuleId: z
    .number()
    .nullish()
    .transform((x) => x ?? undefined),
  stageId: z
    .number()
    .nullish()
    .transform((x) => x ?? undefined),
  players: z.array(z.string()).max(6).optional(),
});

const { handleSubmit, resetForm, values } = useForm({
  validationSchema: schema,
  initialValues: {
    players: players.value,
    gameRuleId: gameRuleId.value,
    stageId: stageId.value,
  },
});

watch(values, () => {
  onSubmit();
});

const onSubmit = handleSubmit(async (values) => {
  await navigateTo({
    query: {
      gameRuleId: values.gameRuleId,
      stageId: values.stageId,
      players: values.players,
    },
  });
});

function reset() {
  resetForm({
    values: {
      gameRuleId: null,
      stageId: null,
      players: [],
    },
  });
}
</script>
