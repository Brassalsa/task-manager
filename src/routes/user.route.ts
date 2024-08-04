import { Hono } from "hono";
import {
  accountDetails,
  deleteAccount,
  loginUser,
  registerUser,
  updateAccount,
} from "../controllers/user.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const userRouter = new Hono();
// register
userRouter.post("/register", registerUser);
// login
userRouter.post("/login", loginUser);

// auth middleware
userRouter.use("/account/*", verifyToken);

// account details
userRouter.get("/account", accountDetails);
// update account
userRouter.put("/account", updateAccount);
// delete account
userRouter.delete("/account", deleteAccount);

export default userRouter;
