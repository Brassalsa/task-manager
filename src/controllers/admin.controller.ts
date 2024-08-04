import db from "../db";
import { ApiError, ApiResponse } from "../utils/ApiResponses";
import asyncHanlder from "../utils/asyncHandler";
import { UserType } from "../utils/constants";
import STATUS from "../utils/constants/statusCode";
import { hashStr } from "../utils/hashing";
import { parseSafeData } from "../utils/helpers";
import {
  idSchema,
  idsSchema,
  pagingSchema,
  registerSchema,
} from "../utils/validators/formData";

const selectedFields = {
  id: true,
  name: true,
  email: true,
  type: true,
};

// get many users
export const getUsers = asyncHanlder(async (c) => {
  const formData = await c.req.parseBody();
  const { data } = parseSafeData(pagingSchema, formData);
  const users = await db.user.findMany({
    skip: data.skip,
    take: data.limit,
    select: selectedFields,
  });
  return c.json(new ApiResponse(users));
});

// create admin user
export const createAdmin = asyncHanlder(async (c) => {
  const formData = await c.req.parseBody();
  const { data } = parseSafeData(registerSchema, formData);
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
  const user = await db.user.create({
    data: {
      ...data,
      password: hashStr(data.password),
      type: UserType.admin,
    },
    select: selectedFields,
  });

  c.status(STATUS.creation as any);
  return c.json(new ApiResponse(user, STATUS.creation));
});

// delete users
export const deleteUsers = asyncHanlder(async (c) => {
  const formData = await c.req.parseBody();
  const { data } = parseSafeData(idsSchema, formData);
  await db.user.deleteMany({
    where: {
      id: {
        in: data.ids,
      },
      type: {
        not: UserType.admin,
      },
    },
  });
  return c.json(new ApiResponse(null, STATUS.ok, "deleted successfully"));
});

// view user details
export const userDetails = asyncHanlder(async (c) => {
  const query = c.req.query();
  const {
    data: { id },
  } = parseSafeData(idSchema, query);
  const user = await db.user.findUnique({
    where: {
      id,
    },
    select: selectedFields,
  });
  if (!user) {
    throw new ApiError("user not found", 404);
  }
  return c.json(new ApiResponse(user));
});

// promote user to admin
export const userToAdmin = asyncHanlder(async (c) => {
  const query = c.req.query();
  const {
    data: { id },
  } = parseSafeData(idSchema, query);

  const dbUser = await db.user.findUnique({
    where: {
      id,
    },
    select: selectedFields,
  });
  if (!dbUser) {
    throw new ApiError("user not found", 404);
  }

  if (dbUser.type == UserType.admin) {
    throw new ApiError("user already admin", 400);
  }

  const user = await db.user.update({
    where: {
      id,
    },
    data: {
      type: UserType.admin,
    },
    select: selectedFields,
  });
  if (!user) {
    throw new ApiError("user not found", 404);
  }
  return c.json(new ApiResponse(user));
});
