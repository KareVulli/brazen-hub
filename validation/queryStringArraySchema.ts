import { z } from "zod";

export const queryStringArraySchema = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((value) => {
    if (typeof value === "string") {
      return [value];
    }
    return value;
  });
