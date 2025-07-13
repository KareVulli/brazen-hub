import { definePreset } from "@primevue/themes";
import Aura from "@primevue/themes/aura";

const CustomAura = definePreset(Aura, {
  semantic: {
    formField: {
      paddingX: "0.75rem",
      paddingY: "0.375rem",
      sm: {
        fontSize: "0.875rem",
        paddingX: "0.625rem",
        paddingY: "0.25rem",
      },
      lg: {
        fontSize: "1.125rem",
        paddingX: "0.875rem",
        paddingY: "0.5rem",
      },
      borderRadius: "{border.radius.sm}",
    },
    navigation: {
      item: {
        padding: "0.25rem 1rem",
      },
    },
  },
  components: {
    button: {
      root: {
        iconOnlyWidth: "2rem",
      },
    },
    menubar: {
      baseItem: {
        padding: "{navigation.item.padding}",
      },
    },
  },
});

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
    "nuxt-auth-utils",
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
        preset: CustomAura,
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
