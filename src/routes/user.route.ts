import { Hono } from "hono";
import { loginUser, registerUser } from "../controllers/user.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const userRouter = new Hono();
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// auth middleware
userRouter.use("/account", verifyToken);

export default userRouter;
