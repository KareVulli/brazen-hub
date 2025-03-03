<template>
  <Panel header="Current public rooms">
    <template #icons>
      <Badge
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
            class="flex"
            :class="{
              'border-t border-surface-200 dark:border-surface-700 pt-4':
                index !== 0,
              'pb-4': index !== slotProps.items.length - 1,
            }"
          >
            <div>
              <div class="flex items-center gap-2">
                <Tag
                  class="block"
                  :value="
                    room.state === 'active' ? 'Open' : 'Match in progress'
                  "
                  :severity="room.state === 'active' ? 'success' : 'secondary'"
                />
                <span class="font-semibold">{{ room.gameRule.name }}</span>
              </div>
              <div class="flex items-center gap-2 mt-1.5">
                Host:
                <LinkedUserName
                  v-if="(room as HomePublicRoom).user"
                  class="inline-block"
                  :user="room.user"
                  small
                />
                <span v-else>{{ room.createdByUserName }}</span>
              </div>
              <p>
                Stage:
                <span class="font-semibold">{{
                  room.stage ? room.stage.name : "Random"
                }}</span>
              </p>
              <p>
                Support items:
                <span class="font-semibold">{{
                  room.supportItems ? "allowed" : "disabled"
                }}</span>
              </p>
            </div>
            <div class="ml-auto text-right">
              <p>
                Join code: {{ room.invitationCode }}
                <CopyButton :content="room.invitationCode" />
              </p>
              <p>Players: {{ room.playerCount }}/{{ room.maxPlayers }}</p>
            </div>
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
