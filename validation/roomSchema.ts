import { z } from "zod";

export const roomSchema = z.object({
  stageId: z.coerce.number().int().positive(),
  gameRuleId: z.coerce.number().int().positive(),
  public: z.coerce.boolean(),
  players: z
    .array(
      z.object({
        userKey: z.string().min(1),
        team: z.coerce.number().int(),
      }),
    )
    .min(1),
});

export type RoomSchema = z.infer<typeof roomSchema>;
