import type { Next } from "hono";
import { ApiError, ApiResponse } from "../utils/ApiResponses";
import { decodeToken } from "../utils/auth/jwt";
import { ResponseT, TokenType, UserContext } from "../types";
import STATUS from "../utils/constants/statusCode";
import db from "../db";
import { UserType } from "../utils/constants";

export const verifyToken = async (c: UserContext, next: Next) => {
  try {
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
  } catch (err: any) {
    c.status(err.statusCode || STATUS.serverErr);

    if (err instanceof ApiError) {
      return c.json({ ...err, errors: undefined });
    }

    console.log(err);
    return c.json({
      success: false,
      code: err.code,
      statusCode: STATUS.serverErr,
      message: err.message,
      data: null,
    });
  }
};

export const verifyAdmin = async (c: UserContext, next: Next) => {
  try {
    const token = c.get("user") as TokenType;
    const user = await db.user.findUnique({
      where: {
        email: token.email,
      },
      select: {
        type: true,
      },
    });
    if (!user || user.type !== UserType.admin) {
      throw new ApiError("unauthorized", STATUS.forbidden);
    }
    await next();
  } catch (err: any) {
    c.status(err.statusCode || STATUS.serverErr);
    if (err instanceof ApiError) {
      return c.json({ ...err, errors: undefined });
    }
    return c.json(new ApiResponse(null, STATUS.serverErr, err.message));
  }
};
