<template>
  <FormInput :dense="dense">
    <FormFieldLabel :name="name" :label="label" />
    <DataView :value="fields">
      <template #list="{ items }: { items: FieldEntry[] }">
        <div class="space-y-2 p-2">
          <Panel v-for="(field, idx) in items" :key="field.key">
            <template #header>
              <p class="font-bold">Player #{{ idx + 1 }}</p>
            </template>
            <template #icons>
              <Button
                icon="pi pi-times"
                severity="secondary"
                rounded
                text
                @click="remove(idx)"
              />
            </template>
            <slot name="fields" :item-name="`${props.name}[${idx}]`" />
          </Panel>
        </div>
      </template>
      <template #footer>
        <Button
          severity="secondary"
          label="Add"
          @click="push(newInitialValue)"
        />
      </template>
      <template #empty>
        <div class="p-2">Click "Add" to add a player.</div>
      </template>
    </DataView>
    <FormFieldError :error-message="errorMessage" />
  </FormInput>
</template>

<script setup lang="ts">
import type { FieldEntry } from "vee-validate";
import { useField, useFieldArray } from "vee-validate";
import type { FormFieldProps } from "./FormInput.vue";

interface FormListFieldPromps extends FormFieldProps {
  newInitialValue: unknown;
}

const props = defineProps<FormListFieldPromps>();

const { remove, push, fields } = useFieldArray(props.name);
const { errorMessage } = useField(() => props.name);
</script>
