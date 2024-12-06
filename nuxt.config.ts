import Aura from "@primevue/themes/aura";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-07-30",
  // Nuxt 4 directory structure and features
  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 },
  // Nuxt Modules
  // https://nuxt.com/modules
  modules: [
    "@nuxthub/core",
    "@nuxt/eslint",
    "@nuxtjs/tailwindcss",
    "@primevue/nuxt-module",
    "nuxt-time",
    "dayjs-nuxt",
  ],
  hub: {
    database: true,
    kv: true,
    blob: false,
    cache: true,
  },
  nitro: {
    experimental: {
      // Enable Server API documentation within NuxtHub
      openAPI: true,
    },
  },
  // Development
  devtools: { enabled: true },
  primevue: {
    options: {
      theme: {
        preset: Aura,
      },
    },
  },
  runtimeConfig: {
    bzToken: "",
    cacheTime: 300,
  },
  dayjs: {
    plugins: ["duration"],
  },
});
