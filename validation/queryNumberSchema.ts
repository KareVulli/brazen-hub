import { z } from "zod";

export const queryNumberSchema = <T>(zodSchema: z.ZodType<T>) =>
  z.preprocess((val) => {
    if (typeof val === "string") {
      if (val === "") {
        return null;
      }
      return Number.parseInt(val);
    }
    return val;
  }, zodSchema);
