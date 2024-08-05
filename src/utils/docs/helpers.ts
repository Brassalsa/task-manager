import { date, z, ZodSchema } from "zod";

export const responseSchema = z.object({
  data: z.any().optional().nullable(),
  statusCode: z.number(),
  message: z.string().optional(),
  success: z.boolean(),
});

export const resSchema = <T>(schema: ZodSchema<T>) => {
  return z.object({
    data: schema,
    statusCode: z.number(),
    message: z.string().optional(),
    success: z.boolean(),
  });
};

export const generateJsonContent = <T>(
  schema: ZodSchema<T>,
  description: string,
  example?: T
) => {
  return {
    content: {
      "application/json": {
        schema: schema,
        example,
      },
    },
    description,
  };
};

export const generateFormContent = <T>(
  schema: ZodSchema<T>,
  description: string,
  example?: T
) => {
  return {
    content: {
      "application/x-www-form-urlencoded": {
        schema: schema,
        example,
      },
    },
    description,
  };
};
