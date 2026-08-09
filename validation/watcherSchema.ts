import { z } from "zod";

export const watcherSchema = z.object({
  code: z.string().regex(/^\d+$/).length(5),
});

export type WatcherSchema = z.infer<typeof watcherSchema>;
