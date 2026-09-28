import { z } from "zod";

export const settingsSchema = z.object({
  maintenance: z.boolean(),
  matchmakingMaintenance: z.boolean(),
});

export type SettingsSchema = z.infer<typeof settingsSchema>;
