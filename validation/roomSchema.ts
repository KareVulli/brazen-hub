import { z } from "zod";

export const roomSchema = z.object({
  stageId: z.coerce.number().int().positive(),
  gameRuleId: z.coerce.number().int().positive(),
  public: z.coerce.boolean(),
});

export type RoomSchema = z.infer<typeof roomSchema>;
