import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string().email(),
  password: z.string().min(5),
});

export const sendEmailSchema = z.object({
  email: z
    .string().email(),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});
