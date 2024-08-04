import db from "../db";
import { TokenType, UserContext } from "../types";
import { ApiError, ApiResponse } from "../utils/ApiResponses";
import asyncHanlder from "../utils/asyncHandler";
import STATUS from "../utils/constants/statusCode";
import { parseSafeData } from "../utils/helpers";
import {
  createTaskSchema,
  pagingSchema,
  tasksFilterSchema,
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
  return c.json(new ApiResponse(null, STATUS.ok, "deleted successfully"));
});

// get user tasks
export const getManyTasks = asyncHanlder(async (c: UserContext) => {
  const user = c.get("user") as TokenType;
  const { filter, page } = getFilterData(c);

  const tasks = await db.task.findMany({
    where: {
      user_id: user.id,
      ...filter,
    },
    skip: page.skip,
    take: page.limit,
  });
  return c.json(new ApiResponse(tasks));
});

// delete user tasks
export const deleteManyTasks = asyncHanlder(async (c: UserContext) => {
  const user = c.get("user") as TokenType;
  const { ids: idStr } = await c.req.parseBody();
  if (!idStr) {
    throw new ApiError("ids are empty", 400);
  }
  const idArr = JSON.parse(idStr as string) as number[];
  await db.task.deleteMany({
    where: {
      id: {
        in: idArr,
      },
      user_id: user.id,
    },
  });
  return c.json(new ApiResponse(null, STATUS.ok, "deleted successfully"));
});

// <------------------------helpers------------------->
// helper for filter data
const getFilterData = (c: UserContext) => {
  const query = c.req.query();
  const safeData = tasksFilterSchema.safeParse(query);
  const { data: filter } = parseSafeData(safeData);

  const pageData = pagingSchema.safeParse(query);
  const { data: page } = parseSafeData(pageData);

  return {
    filter,
    page,
  };
};

// helper for getting user task
const getTaskOrThrow = async (c: UserContext, id: string | number) => {
  const user = c.get("user") as TokenType;
  if (!Number(id)) {
    throw new ApiError("invalid id", STATUS.badRequest);
  }
  const task = await db.task.findUnique({
    where: {
      id: +id,
      user_id: user.id,
    },
  });

  if (!task) {
    throw new ApiError("task not found", STATUS.notFound);
  }
  return task;
};
