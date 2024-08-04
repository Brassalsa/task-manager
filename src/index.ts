import { serve } from "@hono/node-server";
import { Hono } from "hono";
import dotenv from "dotenv";
import userRouter from "./routes/user.route";

dotenv.config();
const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/api/v1/users", userRouter);

const port = Number(process.env.PORT) || 3000;

console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
