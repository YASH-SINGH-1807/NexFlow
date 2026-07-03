import { z } from "zod";

export const loginSchema = z.object({
  login: z
    .string()
    .min(1, "Email or Username is required"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;