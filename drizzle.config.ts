import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./server/db/schema",
  out: "./server/db/migrations",
  dbCredentials: {
    url: ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/a56888355b2792b456d66a6ac73981705520141f25e554e4849a0a54eb82ef8b.sqlite",
  },
});
