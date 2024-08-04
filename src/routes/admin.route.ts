import { Hono } from "hono";
import { verifyAdmin, verifyToken } from "../middlewares/auth.middleware";
import {
  deleteUsers,
  getUsers,
  createAdmin,
  userDetails,
  userToAdmin,
} from "../controllers/admin.controller";

const adminRouter = new Hono();
adminRouter.use("/*", verifyToken);
adminRouter.use("/*", verifyAdmin);

adminRouter.get("/", (c) => {
  return c.json("hello");
});
// users(many)
adminRouter.get("/users", getUsers);
adminRouter.delete("/users", deleteUsers);
// user(single)
adminRouter.get("/user", userDetails);
adminRouter.post("/user", createAdmin);
adminRouter.put("/user", userToAdmin);

export default adminRouter;
