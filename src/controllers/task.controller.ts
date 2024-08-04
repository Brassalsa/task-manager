import db from "../db";
import { TokenType, UserContext } from "../types";
import { ApiError, ApiResponse } from "../utils/ApiResponses";
import asyncHanlder from "../utils/asyncHandler";
import STATUS from "../utils/constants/statusCode";
import { parseSafeData } from "../utils/helpers";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../utils/validators/formData";

// create task
export const createTask = asyncHanlder(async (c: UserContext) => {
  const formData = await c.req.parseBody();
  const safeData = createTaskSchema.safeParse(formData);
  const { data } = parseSafeData(safeData);
  const user = c.get("user") as TokenType;
  const task = await db.task.create({
    data: {
      ...data,
      user_id: user.id,
    },
  });
  return c.json(
    new ApiResponse(
      {
        ...task,
        user_id: undefined,
      },
      STATUS.creation
    )
  );
});

// get task
export const getTask = asyncHanlder(async (c: UserContext) => {
  const { id } = c.req.query();
  const task = await getTaskOrThrow(c, id);
  return c.json({ ...task, user_id: undefined });
});

// update task
export const updateTask = asyncHanlder(async (c: UserContext) => {
  const formData = await c.req.parseBody();
  const safeData = updateTaskSchema.safeParse(formData);
  const { data } = parseSafeData(safeData);
  const user = c.get("user") as TokenType;

  const validTask = await getTaskOrThrow(c, data.id);

  const task = await db.task.update({
    where: {
      id: validTask.id,
      user_id: user.id,
    },
    data,
  });
  return c.json(
    new ApiResponse({
      ...task,
      user_id: undefined,
    })
  );
});

// delete task
export const deleteTask = asyncHanlder(async (c: UserContext) => {
  const { id } = c.req.query();
  const task = await getTaskOrThrow(c, id);
  await db.task.delete({
    where: {
      id: task.id,
    },
  });
  return c.json(new ApiResponse(null, 200, "deleted successfully"));
});

// helper for getting user task
const getTaskOrThrow = async (c: UserContext, id: string | number) => {
  const user = c.get("user") as TokenType;
  if (!Number(id)) {
    throw new ApiError("invalid id", 400);
  }
  const task = await db.task.findUnique({
    where: {
      id: +id,
      user_id: user.id,
    },
  });

  if (!task) {
    throw new ApiError("task not found", 404);
  }
  return task;
};
