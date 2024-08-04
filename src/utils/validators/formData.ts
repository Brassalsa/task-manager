import { title } from "process";
import { z } from "zod";
import { TaskPriority, TaskStatus } from "../constants";

// user schema
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

// task schema
const taskSchema = {
  title: z.string(),
  description: z.string().optional(),
  status: z
    .string()
    .optional()
    .default(TaskStatus.pending)
    .refine((val) => {
      if (val === undefined) return true;
      return Object.keys(TaskStatus).includes(val);
    }),
  priority: z
    .string()
    .optional()
    .default(TaskPriority.normal)
    .refine((val) => {
      if (val === undefined) return true;
      return Object.keys(TaskPriority).includes(val);
    }),
  due_date: z.coerce.date(),
};
export const createTaskSchema = z.object(taskSchema);

export const updateTaskSchema = z.object({
  id: z.coerce.number(),
  ...taskSchema,
});
