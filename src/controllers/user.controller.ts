import db from "../db";
import { ApiError, ApiResponse } from "../utils/ApiResponses";
import asyncHanlder from "../utils/asyncHandler";
import STATUS from "../utils/constants/statusCode";
import { compareHash, hashStr } from "../utils/hashing";
import { loginSchema, registerSchema } from "../utils/validators/formData";
import { parseSafeData } from "../utils/helpers";
import { encodeData } from "../utils/auth/jwt";
import { TokenType, UserContext } from "../types";
import { Context } from "hono";

// register user
export const registerUser = asyncHanlder(async (c) => {
  const parsedBody = await c.req.parseBody();
  // parse form data
  const { data } = parseSafeData(registerSchema, parsedBody);
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
  setAuthHeader(c, token);
  c.status(STATUS.creation as any);
  return c.json(
    new ApiResponse({ token }, STATUS.creation, "user created successfully")
  );
});

// login user
export const loginUser = asyncHanlder(async (c) => {
  const formData = await c.req.parseBody();
  const { data } = parseSafeData(loginSchema, formData);
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

  setAuthHeader(c, token);
  return c.json(new ApiResponse({ token }));
});

// get account details
export const accountDetails = asyncHanlder(async (c: UserContext) => {
  const user = c.get("user");
  const account = await db.user.findUnique({
    where: user,
    select: {
      name: true,
      email: true,
      id: true,
    },
  });
  if (!account) {
    setAuthHeader(c, "");
    throw new ApiError("user not found", STATUS.notFound);
  }
  return c.json(new ApiResponse(account));
});

// update account
export const updateAccount = asyncHanlder(async (c: UserContext) => {
  const formData = await c.req.parseBody();
  const { data } = parseSafeData(registerSchema, formData);
  const user = c.get("user");
  // check if duplicate email
  const dup = await db.user.findUnique({
    where: {
      email: data.email,
      NOT: {
        id: user.id,
      },
    },
    select: {
      id: true,
    },
  });

  if (dup) {
    throw new ApiError("email already exists", STATUS.badRequest);
  }

  // update user
  const updateUser = await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      ...data,
      password: hashStr(data.password),
    },
    select: {
      id: true,
      email: true,
    },
  });
  // update token
  const token = await encodeData(updateUser satisfies TokenType);
  setAuthHeader(c, token);
  return c.json(new ApiResponse({ token }, STATUS.ok, "updated successfully"));
});

// delete account
export const deleteAccount = asyncHanlder(async (c: UserContext) => {
  const formData = await c.req.parseBody();
  const { data } = parseSafeData(loginSchema, formData);
  const token = c.get("user");
  // check account email
  if (token.email !== data.email) {
    throw new ApiError("wrong email", STATUS.badRequest);
  }
  const user = await db.user.findUnique({
    where: {
      id: token.id,
      email: data.email,
    },
  });

  if (!user) {
    throw new ApiError("user not found", STATUS.notFound);
  }
  // check password
  const pass = compareHash(data.password, user.password);

  if (!pass) {
    throw new ApiError("wrong password", STATUS.badRequest);
  }

  // delete
  await db.user.delete({
    where: {
      id: user.id,
    },
  });

  return c.json(new ApiResponse("deleted successfully"));
});

//<------------------------ helpers ------------------------------------->
const setAuthHeader = (c: Context, token: string) => {
  c.header("Authorization", `Bearer ${token}`);
};
