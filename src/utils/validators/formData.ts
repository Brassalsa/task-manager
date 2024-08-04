import { z } from "zod";

const password = z
  .string()
  .min(8, { message: "password must be at least 8 characters long" })
  .regex(/[0-9]/, { message: "Password must include at least one number" })
  .regex(/[!@#$%^&*()/\][,.?"\\:{}|<>]/, {
    message: "Password must include at least one special character",
  });

export const registerSchema = z.object({
  email: z.string().email({ message: "invalid email address" }),
  name: z.string().optional(),
  password,
});

export const loginSchema = z.object({
  email: z.string().email({ message: "invalid email address" }),
  password,
});
