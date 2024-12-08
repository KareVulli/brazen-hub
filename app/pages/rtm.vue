<template>
  <main>
    <h1 class="mb-4 text-lg">Round Team Match Leaderboard</h1>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <h2 class="mb-4 text-center">Weekly</h2>
        <iframe
          class="w-full aspect-square"
          src="https://web-view.prod.brazenblaze.com/leaderboard/weekly"
        />
      </div>
      <div>
        <h2 class="mb-4 text-center">Daily</h2>
        <iframe
          class="w-full aspect-square"
          src="https://web-view.prod.brazenblaze.com/leaderboard/daily"
        />
      </div>
    </div>
  </main>
</template>
