import { z } from "zod";

export const loginCredentialsSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(64, "Username must be at most 64 characters")
    .regex(/^\S+$/, "Username must not contain spaces"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be at most 128 characters"),
});
