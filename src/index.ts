import { serve } from "@hono/node-server";
import { Hono } from "hono";
import dotenv from "dotenv";
import userRouter from "./routes/user.route";
import taskRouter from "./routes/task.route";
import adminRouter from "./routes/admin.route";

dotenv.config();
const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/api/v1/users", userRouter);
app.route("/api/v1/tasks", taskRouter);
app.route("/api/v1/admin", adminRouter);

const port = Number(process.env.PORT) || 3000;

console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
