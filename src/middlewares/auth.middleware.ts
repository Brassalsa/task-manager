import type { Next } from "hono";
import { ApiResponse } from "../utils/ApiResponses";
import { decodeToken } from "../utils/auth/jwt";
import { ResponseT, UserContext } from "../types";

export const verifyToken = async (c: UserContext, next: Next) => {
  const header = c.req.header();
  const tokenArr = header["authorization"].split("Bearer ");
  const token = tokenArr[1];
  if (!token) {
    return c.json(
      new ApiResponse(null, 401, "token malformed") satisfies ResponseT<null>
    );
  }

  const user = await decodeToken(token);
  c.set("user", user);
  await next();
};
