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
  generateFormContent,
  generateJsonContent,
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
    security: [{ AuthBearer: [] }],
    request: {
      query: idsSchema,
    },
    responses: {
      200: generateJsonContent(resSchema(updateTaskSchema), "success"),
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
    security: [{ AuthBearer: [] }],
    request: {
      body: generateFormContent(createTaskSchema, ""),
    },
    responses: {
      200: generateJsonContent(createTaskSchema, "success"),
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
    security: [{ AuthBearer: [] }],
    request: {
      body: generateFormContent(updateTaskSchema, ""),
    },
    responses: {
      200: generateJsonContent(updateTaskSchema, "success"),
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
    security: [{ AuthBearer: [] }],
    request: {
      body: generateFormContent(idSchema, "Enter"),
    },
    responses: {
      200: generateJsonContent(updateTaskSchema, "success"),
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
    security: [{ AuthBearer: [] }],
    request: {
      query: pagingSchema,
    },
    responses: {
      200: generateJsonContent(
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
    security: [{ AuthBearer: [] }],
    request: {
      body: generateFormContent(idsSchema, "", { ids: [1, 2, 3] }),
    },
    responses: {
      201: generateJsonContent(responseSchema, "success"),
      404: notFound(),
      500: serverErr(),
    },
  }),
  deleteManyTasks as any
);

export default taskRouter;
