import { z } from "zod";

export const matchUpdateSchema = z.object({
  teams: z.record(
    z.string().regex(/^\d+$/),
    z.object({
      wins: z.coerce.number().int().nonnegative().default(0),
    }),
  ),
});

export type MatchUpdateSchema = z.infer<typeof matchUpdateSchema>;
