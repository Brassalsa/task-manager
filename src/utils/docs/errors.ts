import { createRoute, z } from "@hono/zod-openapi";
import { ResponseT } from "../../types";
import STATUS from "../constants/statusCode";
import { ApiResponse } from "../ApiResponses";
import { generateContent, responseSchema } from "./helpers";
export const errorSchema = {
  schema: z.object({
    success: z.boolean(),
    statusCode: z.number(),
    message: z.string(),
    data: z.null(),
  }),
};

export const errorResp = (message: string, statusCode?: number) => {
  return new ApiResponse(null, statusCode, message);
};

export const notFound = (msg = "not found") => {
  return generateContent(
    responseSchema,
    "Error",
    new ApiResponse(null, 404, msg)
  );
};

export const serverErr = (msg = "something went wrong") => {
  return generateContent(
    responseSchema,
    "Bad Request",
    new ApiResponse(null, 500, msg)
  );
};

export const badRequest = (msg = "bad request") => {
  return generateContent(
    responseSchema,
    "Server Error",
    new ApiResponse(null, 400, msg)
  );
};
