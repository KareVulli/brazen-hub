import Aura from "@primevue/themes/aura";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-07-30",
  // Nuxt 4 directory structure and features
  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 },
  modules: [
    "@nuxthub/core",
    "@nuxt/eslint",
    "@nuxtjs/tailwindcss",
    "@primevue/nuxt-module",
    "nuxt-time",
    "dayjs-nuxt",
    ["nuxt-plotly", { inject: true }],
    "@vueuse/nuxt",
  ],
  css: ["primeicons/primeicons.css"],
  app: {
    head: {
      link: [
        {
          rel: "icon",
          type: "image/png",
          sizes: "96x96",
          href: "/favicon-96x96.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        { rel: "shortcut icon", href: "/favicon.ico" },
        { rel: "manifest", href: "/site.webmanifest" },
      ],
    },
  },
  hub: {
    database: true,
    kv: false,
    blob: false,
    cache: true,
  },
  nitro: {
    experimental: {
      // Enable Server API documentation within NuxtHub
      openAPI: true,
    },
  },
  devtools: { enabled: true },
  primevue: {
    options: {
      theme: {
        preset: Aura,
      },
      ripple: true,
    },
  },
  runtimeConfig: {
    bzToken: "",
    cacheTime: 60,
    refreshTime: 600,
    updateToken: "",
    gameVersion: "",
    gameVersionCode: "",
    gameHash: "",
  },
  dayjs: {
    plugins: ["duration"],
  },
  vite: {
    optimizeDeps: {
      include: ["plotly.js-dist-min"],
    },
  },
});
