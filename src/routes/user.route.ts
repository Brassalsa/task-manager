import {
  accountDetails,
  deleteAccount,
  loginUser,
  registerUser,
  updateAccount,
} from "../controllers/user.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { loginSchema, registerSchema } from "../utils/validators/formData";
import {
  generateContent,
  responseSchema,
  resSchema,
} from "../utils/docs/helpers";
import { ApiResponse } from "../utils/ApiResponses";
import { badRequest, notFound, serverErr } from "../utils/docs/errors";

const tags = ["User"];
const userRouter = new OpenAPIHono();
// register
userRouter.post("/register", registerUser);
userRouter.openapi(
  createRoute({
    tags,
    method: "post",
    path: "/register",
    description: "Register",
    request: {
      body: generateContent(registerSchema, ""),
    },
    responses: {
      201: generateContent(
        resSchema(
          z.object({
            token: z.string(),
          })
        ),
        "success"
      ),
      400: badRequest("email already exists"),
      500: serverErr(),
    },
  }),
  registerUser as any
);
// login
userRouter.post("/login", loginUser);
userRouter.openapi(
  createRoute({
    tags,
    method: "post",
    path: "/login",

    description: "Login",
    request: {
      body: generateContent(loginSchema, ""),
    },
    responses: {
      200: generateContent(loginSchema, "success"),
      404: notFound(),
      500: serverErr(),
    },
  }),
  loginUser as any
);

// auth middleware
userRouter.use("/account/*", verifyToken);

// account details
userRouter.get("/account", accountDetails);
userRouter.openapi(
  createRoute({
    tags,
    method: "get",
    path: "/account",
    description: "Account Details",
    responses: {
      200: generateContent(
        responseSchema,
        "success",
        new ApiResponse({ id: 0, name: "John", email: "john@wick.org" })
      ),
      404: notFound(),
      500: serverErr(),
    },
  }),
  accountDetails as any
);
// update account
userRouter.put("/account", updateAccount);
userRouter.openapi(
  createRoute({
    tags,
    method: "put",
    path: "/account",
    description: "Update Account",
    request: {
      body: generateContent(registerSchema, ""),
    },
    responses: {
      200: generateContent(registerSchema, "success"),
      404: notFound(),
      500: serverErr(),
    },
  }),
  updateAccount as any
);
// delete account
userRouter.delete("/account", deleteAccount);
userRouter.openapi(
  createRoute({
    tags,
    method: "delete",
    path: "/account",
    description: "Delete account",
    request: {
      body: generateContent(loginSchema, ""),
    },
    responses: {
      200: generateContent(loginSchema, "success"),
      404: notFound(),
      500: serverErr(),
    },
  }),
  deleteAccount as any
);

export default userRouter;
