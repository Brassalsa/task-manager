import { Context } from "hono";
import STATUS from "./constants/statusCode";

type Cb = (c: Context) => Promise<any>;

const asyncHanlder = async (cb: Cb) => async (c: Context) => {
  try {
    await cb(c);
  } catch (err: any) {
    c.status(err.statusCode || STATUS.serverErr);
    c.json({
      success: false,
      code: err.code,
      statusCode: +err.statusCode || STATUS.serverErr,
      message: err.message,
      data: null,
    });
  }
};

export default asyncHanlder;
