import { z } from "zod";

export const matchSchema = z.object({
  roomSessionId: z.coerce.number().int().positive(),
  gameRuleId: z.coerce.number().int().positive(),
  stageId: z.coerce.number().int().positive(),
  teams: z.record(
    z.string().regex(/^\d+$/),
    z.object({
      players: z.record(
        z.string(),
        z.object({
          name: z.string(),
          iconId: z.coerce.number().int(),
          iconFrameId: z.coerce.number().int(),
          bot: z.boolean(),
          characterId: z.coerce.number().int(),
          subWeaponId: z.coerce.number().int(),
        }),
      ),
    }),
  ),
});

export type MatchSchema = z.infer<typeof matchSchema>;
