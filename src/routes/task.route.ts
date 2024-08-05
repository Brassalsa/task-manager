import { verifyToken } from "../middlewares/auth.middleware";
import {
  createTask,
  deleteManyTasks,
  deleteTask,
  getManyTasks,
  getTask,
  updateTask,
} from "../controllers/task.controller";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import {
  generateContent,
  responseSchema,
  resSchema,
} from "../utils/docs/helpers";
import {
  createTaskSchema,
  idSchema,
  idsSchema,
  pagingSchema,
  taskSchema,
  updateTaskSchema,
} from "../utils/validators/formData";
import { badRequest, notFound, serverErr } from "../utils/docs/errors";

const tags = ["Task"];
const taskRouter = new OpenAPIHono();
// only auth
taskRouter.use("/*", verifyToken);

// get task
taskRouter.get("/task", getTask);
taskRouter.openapi(
  createRoute({
    tags,
    method: "get",
    path: "/task",
    description: "Get Task",
    request: {
      body: generateContent(resSchema(createTaskSchema), ""),
    },
    responses: {
      200: generateContent(resSchema(updateTaskSchema), "success"),
      404: notFound(),
      500: serverErr(),
    },
  }),
  getTask as any
);
// create task
taskRouter.post("/task", createTask);
taskRouter.openapi(
  createRoute({
    tags,
    method: "post",
    path: "/task",
    description: "Create task",
    request: {
      body: generateContent(createTaskSchema, ""),
    },
    responses: {
      200: generateContent(createTaskSchema, "success"),
      400: badRequest(),
      500: serverErr(),
    },
  }),
  createTask as any
);
// update task
taskRouter.put("/task", updateTask);
taskRouter.openapi(
  createRoute({
    tags,
    method: "put",
    path: "/task",
    description: "Update task",
    request: {
      body: generateContent(updateTaskSchema, ""),
    },
    responses: {
      200: generateContent(updateTaskSchema, "success"),
      404: notFound(),
      500: serverErr(),
    },
  }),
  updateTask as any
);
// delete task
taskRouter.delete("/task", deleteTask);
taskRouter.openapi(
  createRoute({
    tags,
    method: "delete",
    path: "/task?id=1",
    description: "Delete task",

    request: {
      body: generateContent(idSchema, "Enter"),
    },
    responses: {
      200: generateContent(updateTaskSchema, "success"),
      404: notFound(),
      500: serverErr(),
    },
  }),
  deleteTask as any
);

// get many tasks
taskRouter.get("/list", getManyTasks);
taskRouter.openapi(
  createRoute({
    tags,
    method: "get",
    path: "/list",
    description: "get many task",
    request: {
      query: pagingSchema,
    },
    responses: {
      200: generateContent(
        z.array(
          z.object({
            id: z.number(),
            ...taskSchema,
          })
        ),
        "success"
      ),
      400: badRequest(),
    },
  }),
  getManyTasks as any
);
// delete many tasks
taskRouter.delete("/list", deleteManyTasks);
taskRouter.openapi(
  createRoute({
    tags,
    method: "delete",
    path: "/list",
    description: "Delete Tasks",
    request: {
      body: generateContent(idsSchema, "", { ids: [1, 2, 3] }),
    },
    responses: {
      201: generateContent(responseSchema, "success"),
      404: notFound(),
      500: serverErr(),
    },
  }),
  deleteManyTasks as any
);

export default taskRouter;
