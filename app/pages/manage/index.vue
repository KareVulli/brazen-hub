<template>
  <main>
    <PageTitle title="Welcome to management!" />
    <div class="grid lg:grid-cols-2 grid-flow-dense gap-4 mb-4">
      <p>Only admins can see this!</p>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth-admin"],
});
</script>
