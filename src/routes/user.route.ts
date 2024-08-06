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
  generateFormContent,
  generateJsonContent,
  responseSchema,
  resSchema,
} from "../utils/docs/helpers";
import { ApiResponse } from "../utils/ApiResponses";
import {
  badRequest,
  notFound,
  serverErr,
  unprocessable,
} from "../utils/docs/errors";

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
      body: generateFormContent(registerSchema, "Register"),
    },
    responses: {
      201: generateJsonContent(
        resSchema(
          z.object({
            token: z.string(),
          })
        ),
        "success"
      ),
      400: badRequest("email already exists"),
      422: unprocessable(),
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
      body: generateFormContent(loginSchema, ""),
    },
    responses: {
      200: generateJsonContent(loginSchema, "success"),
      404: notFound(),
      422: unprocessable(),
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
    security: [{ AuthBearer: [] }],
    responses: {
      200: generateJsonContent(
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
    security: [{ AuthBearer: [] }],
    request: {
      headers: z.object({
        authorization: z.string().optional(),
      }),
      body: generateFormContent(registerSchema, ""),
    },
    responses: {
      200: generateJsonContent(registerSchema, "success"),
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
    security: [{ AuthBearer: [] }],
    request: {
      headers: z.object({
        authorization: z.string().optional(),
      }),
      body: generateFormContent(loginSchema, ""),
    },
    responses: {
      200: generateJsonContent(loginSchema, "success"),
      404: notFound(),

      500: serverErr(),
    },
  }),
  deleteAccount as any
);

export default userRouter;
