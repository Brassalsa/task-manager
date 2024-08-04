import { Hono } from "hono";
import { verifyToken } from "../middlewares/auth.middleware";
import {
  createTask,
  deleteTask,
  getTask,
  updateTask,
} from "../controllers/task.controller";

const taskRouter = new Hono();
// only auth
taskRouter.use("/*", verifyToken);

// get task
taskRouter.get("/task", getTask);
// create task
taskRouter.post("/task", createTask);
// update task
taskRouter.put("/task", updateTask);
// delete task
taskRouter.delete("/task", deleteTask);

export default taskRouter;
