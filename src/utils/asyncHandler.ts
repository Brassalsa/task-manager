import { Context, Next, TypedResponse } from "hono";
import STATUS from "./constants/statusCode";
import { ApiError } from "./ApiResponses";
type Cb<T extends Context, R extends TypedResponse> = (
  c: T,
  next?: Next
) => Promise<R>;

const asyncHanlder =
  <T extends Context, R extends TypedResponse>(cb: Cb<T, R>) =>
  async (c: T, next?: Next) => {
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
