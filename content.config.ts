import { defineContentConfig, defineCollection } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    wiki: defineCollection({
      type: "page",
      source: {
        include: "wiki/**/*.md",
        prefix: "/",
      },
    }),
    changelog: defineCollection({
      type: "page",
      source: {
        include: "changelog/**/*.md",
        prefix: "/",
      },
    }),
  },
});
