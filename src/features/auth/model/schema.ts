import { z } from "zod";

export const loginCredentialsSchema = z.object({
  username: z
    .string()
    .min(1, "required")
    .max(64, "tooLong")
    .regex(/^\S+$/, "noSpaces"),
  password: z.string().min(6, "tooShort").max(128, "tooLong"),
});
