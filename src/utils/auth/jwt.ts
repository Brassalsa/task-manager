import { sign, verify } from "hono/jwt";
import { getEnvOrThrow } from "../helpers";
import { JWTPayload } from "hono/utils/jwt/types";

const secret = getEnvOrThrow(process.env.JWT_SECRET, "jwt secret not in env");

export const encodeData = async (payload: JWTPayload) => {
  return await sign(payload, secret);
};

export const decodeToken = async <T>(token: string) => {
  return (await verify(token, secret)) as T;
};
