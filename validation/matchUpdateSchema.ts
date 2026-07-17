import { z } from "zod";

export const matchUpdateSchema = z.object({
  teams: z.record(
    z.string().regex(/^\d+$/),
    z.object({
      wins: z.coerce.number().int().nonnegative(),
    }),
  ),
  players: z.record(
    z.string(),
    z.object({
      kills: z.coerce.number().int(),
      stuns: z.coerce.number().int(),
      deaths: z.coerce.number().int(),
      revives: z.coerce.number().int(),
      healed: z.coerce.number().int(),
      skill: z.coerce.number().int(),
      ultimate: z.coerce.number().int(),
      damage: z.coerce.number().int(),
      aliveDuration: z.coerce.number().int(),
    }),
  ),
  endedAt: z.coerce.number().int().optional().nullable().default(null),
});

export type MatchUpdateSchema = z.infer<typeof matchUpdateSchema>;
