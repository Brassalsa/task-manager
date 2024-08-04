import db from "../db";
import { ApiError, ApiResponse } from "../utils/ApiResponses";
import asyncHanlder from "../utils/asyncHandler";
import STATUS from "../utils/constants/statusCode";
import { compareHash, hashStr } from "../utils/hashing";
import { loginSchema, registerSchema } from "../utils/validators/formData";
import { parseSafeData } from "../utils/helpers";
import { encodeData } from "../utils/auth/jwt";
import { TokenType } from "../types";

// register user
export const registerUser = asyncHanlder(async (c) => {
  const parsedBody = await c.req.parseBody();
  // parse form data
  const safeData = registerSchema.safeParse(parsedBody);
  const { data } = parseSafeData(safeData);
  // check if user already exists
  const dup = await db.user.findUnique({
    where: {
      email: data.email,
    },
    select: {
      id: true,
    },
  });

  if (dup) {
    throw new ApiError("email already exists", STATUS.badRequest);
  }

  // create user
  const user = await db.user.create({
    data: {
      ...data,
      password: hashStr(data.password),
    },
    select: {
      id: true,
      email: true,
    },
  });
  const token = await encodeData(user satisfies TokenType);
  c.status(STATUS.creation as any);
  return c.json(
    new ApiResponse(null, STATUS.creation, "user created successfully")
  );
});

// login user
export const loginUser = asyncHanlder(async (c) => {
  const formData = await c.req.parseBody();
  const safeData = loginSchema.safeParse(formData);
  const { data } = parseSafeData(safeData);
  const user = await db.user.findUnique({
    where: {
      email: data.email,
    },
    select: {
      id: true,
      email: true,
      password: true,
    },
  });

  if (!user) {
    throw new ApiError("email not found", STATUS.notFound);
  }
  const pass = compareHash(data.password, user.password);
  if (!pass) {
    throw new ApiError("wrong password", STATUS.unprocessable);
  }
  const token = await encodeData({
    id: user.id,
    email: user.email,
  } satisfies TokenType);

  c.header("Authorization", `Bearer ${token}`);
  return c.json(new ApiResponse("logged in"));
});
