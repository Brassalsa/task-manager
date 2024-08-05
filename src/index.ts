import { serve } from "@hono/node-server";
import { Hono } from "hono";
import dotenv from "dotenv";
import userRouter from "./routes/user.route";
import taskRouter from "./routes/task.route";
import adminRouter from "./routes/admin.route";
import { OpenAPIHono, z } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";

dotenv.config();
const app = new OpenAPIHono();
app.doc("/api/docs", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Task Manager api",
  },
  security: [
    {
      secureHeaders: [],
      bearerAuth: [],
      Bearer: [],
    },
  ],
  tags: [
    { name: "User", description: "User related endpoints" },
    { name: "Task", description: "Task related endpoints" },
    { name: "Admin", description: "Admin related endpoints" },
  ],
});

app.get(
  "/docs",
  swaggerUI({
    url: "/api/docs",
    withCredentials: true,
  })
);
app.openAPIRegistry.registerComponent("securitySchemes", "AuthBearer", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});
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
