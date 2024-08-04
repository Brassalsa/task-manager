import { Context, Next } from "hono";
import STATUS from "./constants/statusCode";
import { ApiError } from "./ApiResponses";
type Cb = (c: Context, next?: Next) => Promise<Response>;

const asyncHanlder = (cb: Cb) => async (c: Context, next?: Next) => {
  try {
    return await cb(c, next);
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

export default asyncHanlder;
