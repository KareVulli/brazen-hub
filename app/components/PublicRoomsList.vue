<template>
  <Panel header="Current public rooms">
    <template #icons>
      <Tag
        v-if="publicRooms.length"
        :value="publicRooms.length"
        severity="secondary"
      />
    </template>
    <DataView :value="publicRooms" data-key="room.roomId">
      <template #empty
        >No active public rooms.
        <AppLink
          v-tooltip.top="{
            value: 'Click to launch the game on Steam',
            pt: {
              text: 'text-sm',
              root: '!max-w-64',
            },
          }"
          to="steam://launch/2511050"
          >Go make one!</AppLink
        ></template
      >
      <template #list="slotProps">
        <div class="flex flex-col">
          <div
            v-for="(room, index) in slotProps.items"
            :key="room.roomId"
            class="flex flex-col"
            :class="{
              'border-t border-surface-200 dark:border-surface-700 pt-4':
                index !== 0,
              'pb-4': index !== slotProps.items.length - 1,
            }"
          >
            <div class="flex items-center gap-2">
              <Tag
                class="block"
                :value="room.state === 'active' ? 'Open' : 'Match in progress'"
                :severity="room.state === 'active' ? 'success' : 'secondary'"
              />
              <span>Join code: {{ room.invitationCode }}</span>
              <span class="ml-auto"
                >Players: {{ room.playerCount }}/{{ room.maxPlayers }}</span
              >
            </div>
            <span class="flex items-center gap-2 mt-1.5">
              Host:
              <LinkedUserName
                v-if="(room as HomePublicRoom).user"
                class="inline-block"
                :user="room.user"
                small
              />
              <span v-else>{{ room.createdByUserName }}</span>
            </span>
            <span
              >Support items:
              <span class="font-semibold">{{
                room.supportItems ? "allowed" : "disabled"
              }}</span></span
            >
            <span
              >Stage:
              <span class="font-semibold">{{
                room.stage ? room.stage.name : "Random"
              }}</span></span
            >
          </div>
        </div>
      </template>
    </DataView>
  </Panel>
</template>

<script setup lang="ts">
import type { HomePublicRoom } from "~~/server/api/home/index.get";

defineProps<{
  publicRooms: HomePublicRoom[];
}>();
</script>
