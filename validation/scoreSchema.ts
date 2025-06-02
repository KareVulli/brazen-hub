import { z } from "zod";

export const scoreSchema = z.object({
  userId: z.coerce.number().int().positive(),
  time: z.coerce.number().int().positive(),
  score: z.coerce.number().int().positive(),
  ruleId: z.coerce.number().int().positive(),
  characterId: z.coerce.number().int().positive(),
  subWeaponId: z.coerce.number().int().positive(),
  setAt: z.coerce.number().int().positive(),
});

export type ScoreSchema = z.infer<typeof scoreSchema>;
