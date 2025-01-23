<template>
  <main>
    <PageTitle title="Welcome to Brazen Hub!" />
    <div v-if="data" class="grid xl:grid-cols-2 gap-4 mb-4">
      <Panel header="Current weekly challenge">
        <template #icons>
          <AppLink
            v-if="data.weekly"
            class="text-sm"
            :to="{ path: `/weekly-challenges/${data.weekly.eventId}` }"
            >Go to leaderboard</AppLink
          >
        </template>
        <template v-if="data.weekly">
          <p v-if="data.weekly.rule" class="capitalize">
            {{ data.weekly.rule.name.toLowerCase() }}
          </p>
          <p v-if="data.weekly.rule">{{ data.weekly.rule.stageName }}</p>
          <p>
            Runner:
            <CharacterName
              v-if="data.weekly.character"
              :character="data.weekly.character"
            />
            <template v-else>Any</template>
          </p>
          <p>
            Sub-Weapon:
            {{ data.weekly.subWeapon?.name || "Any" }}
          </p>
          <p>
            <NuxtTime
              :datetime="
                $dayjs(data.weekly.endsAt * 1000)
                  .subtract(7, 'days')
                  .toDate()
              "
              date-style="medium"
              time-style="short"
            />
            -
            <NuxtTime
              :datetime="new Date(data.weekly.endsAt * 1000)"
              date-style="medium"
              time-style="short"
            />
            -
            <span class="text-green-500 font-bold"
              >Ends
              <NuxtTime
                :datetime="new Date(data.weekly.endsAt * 1000)"
                relative
            /></span>
          </p>
        </template>
        <template v-else>No active weekly challenge</template>
      </Panel>
      <Panel v-if="data" header="Current public rooms">
        <template #icons>
          <Tag
            v-if="data.publicRooms.length"
            :value="data.publicRooms.length"
            severity="secondary"
          />
        </template>
        <DataView :value="data.publicRooms" data-key="room.roomId">
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
                    :value="
                      room.state === 'active' ? 'Open' : 'Match in progress'
                    "
                    :severity="
                      room.state === 'active' ? 'success' : 'secondary'
                    "
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
              </div>
            </div>
          </template>
        </DataView>
      </Panel>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { HomePublicRoom } from "~~/server/api/home.get";

const { data } = useFetch("/api/home");
</script>
