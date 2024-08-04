import { ZodSchema } from "zod";
import { ApiError } from "../ApiResponses";
import STATUS from "../constants/statusCode";

export function parseSafeData<T>(
  schema: ZodSchema<T>,
  data: {
    [x: string]: string | File;
  }
) {
  const safeData = schema.safeParse(data);
  if (!safeData.success) {
    const errors = safeData.error.flatten().fieldErrors;
    const keys = Object.keys(errors);
    const error = errors[keys[0] as keyof typeof errors]![0];
    throw new ApiError(
      `${keys[0]}: ${error}`.toLocaleLowerCase(),
      STATUS.unprocessable
    );
  }
  return safeData;
}

export function getEnvOrThrow(env: string | undefined, msg: string) {
  if (!env) {
    throw new Error(msg);
  }
  return env;
}
