import { SafeParseReturnType } from "zod";
import { ApiError } from "../ApiResponses";
import STATUS from "../constants/statusCode";

export function parseSafeData<I, O>(safeData: SafeParseReturnType<I, O>) {
  if (!safeData.success) {
    console.log(safeData.error);
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
