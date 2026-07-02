import { z } from "zod";
import { matchUpdateSchema } from "./matchUpdateSchema";

export const matchSchema = matchUpdateSchema.extend({
  roomId: z.coerce.number().int().positive(),
  stageId: z.coerce.number().int().positive(),
});

export type MatchSchema = z.infer<typeof matchSchema>;
