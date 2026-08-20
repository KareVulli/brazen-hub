import { z } from "zod";
import { matchUpdateSchema } from "./matchUpdateSchema";

const reviveEventSchema = z.object({
  name: z.literal("revive"),
  data: z.object({
    sourceUserKey: z.string().nullable(),
    targetUserKey: z.string(),
  }),
  eventAt: z.coerce.number().int(),
});

const stunEventSchema = z.object({
  name: z.literal("stun"),
  data: z.object({
    sourceUserKey: z.string().nullable(),
    targetUserKey: z.string(),
  }),
  eventAt: z.coerce.number().int(),
});

const killEventSchema = z.object({
  name: z.literal("kill"),
  data: z.object({
    sourceUserKey: z.string().nullable(),
    targetUserKey: z.string(),
  }),
  eventAt: z.coerce.number().int(),
});

const roundStartEventSchema = z.object({
  name: z.literal("round-start"),
  data: z.object({
    round: z.number().positive().int(),
  }),
  eventAt: z.coerce.number().int(),
});

const roundEndEventSchema = z.object({
  name: z.literal("round-end"),
  data: matchUpdateSchema.extend({
    round: z.number().positive().int(),
    winnerTeamIndex: z.number().int(),
    startedAt: z.coerce.number().int(),
    endedAt: z.coerce.number().int(),
  }),
  eventAt: z.coerce.number().int(),
});

export const matchEventSchema = z.discriminatedUnion("name", [
  reviveEventSchema,
  stunEventSchema,
  killEventSchema,
  roundStartEventSchema,
  roundEndEventSchema,
]);

export type MatchEventSchema = z.infer<typeof matchEventSchema>;
