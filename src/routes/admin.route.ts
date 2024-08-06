import { verifyAdmin, verifyToken } from "../middlewares/auth.middleware";
import {
  deleteUsers,
  getUsers,
  createAdmin,
  userDetails,
  userToAdmin,
} from "../controllers/admin.controller";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import {
  generateFormContent,
  generateJsonContent,
  responseSchema,
} from "../utils/docs/helpers";
import { ApiResponse } from "../utils/ApiResponses";
import { idSchema, idsSchema } from "../utils/validators/formData";
import STATUS from "../utils/constants/statusCode";
import { badRequest, notFound, serverErr } from "../utils/docs/errors";

const tags = ["Admin"];
const adminRouter = new OpenAPIHono();
adminRouter.use("/*", verifyToken);
adminRouter.use("/*", verifyAdmin);

adminRouter.get("/", (c) => {
  return c.json("hello");
});
// users(many)
adminRouter.get("/users", getUsers);
adminRouter.openapi(
  createRoute({
    tags,
    method: "get",
    path: "/users",
    description: "Admin: Get Users List",
    security: [{ AuthBearer: [] }],
    responses: {
      200: generateJsonContent(
        responseSchema,
        "success",
        new ApiResponse(
          [
            {
              id: 1,
              name: "John",
              email: "wick@co.org",
              type: "admin",
            },
          ],
          200
        )
      ),
    },
  }),
  getUsers as any
);
// delete users
adminRouter.delete("/users", deleteUsers);
adminRouter.openapi(
  createRoute({
    tags,
    method: "delete",
    path: "/users",
    description: "Admin: Delete Users",
    security: [{ AuthBearer: [] }],
    request: {
      body: generateFormContent(idsSchema, "", {
        ids: [1, 2, 3, 4],
      }),
    },
    responses: {
      200: generateJsonContent(
        responseSchema,
        "success",
        new ApiResponse(null, STATUS.ok, "deleted")
      ),
      404: notFound("user not found"),
      500: serverErr(),
    },
  }),
  deleteUsers as any
);

// user(single)
adminRouter.get("/user", userDetails);
adminRouter.openapi(
  createRoute({
    tags,
    method: "get",
    path: "/user",
    description: "Admin: Get User Details",
    security: [{ AuthBearer: [] }],
    request: {
      body: generateFormContent(idSchema, "Enter id", { id: 1 }),
    },
    responses: {
      200: generateJsonContent(
        responseSchema,
        "success",
        new ApiResponse(
          [
            {
              id: 1,
              name: "John",
              email: "wick@co.org",
              type: "admin",
            },
          ],
          200
        )
      ),
      404: notFound("user not found"),
      500: serverErr(),
    },
  }),
  userDetails as any
);
// create admin user
adminRouter.post("/user", createAdmin);
adminRouter.openapi(
  createRoute({
    tags,
    method: "post",
    path: "/users",
    description: "Admin: Create Admin",
    security: [{ AuthBearer: [] }],
    responses: {
      201: generateJsonContent(
        responseSchema,
        "success",
        new ApiResponse(
          {
            id: 1,
            name: "John",
            email: "wick@co.org",
            type: "admin",
          },
          STATUS.creation
        )
      ),
      400: badRequest("email already exists"),
      500: serverErr(),
    },
  }),
  createAdmin as any
);
adminRouter.put("/user", userToAdmin);
adminRouter.openapi(
  createRoute({
    tags,
    method: "put",
    path: "/users",
    description: "Admin: Promote user to admin",
    security: [{ AuthBearer: [] }],
    request: {
      body: generateFormContent(idSchema, ""),
    },
    responses: {
      200: generateJsonContent(
        responseSchema,
        "success",
        new ApiResponse(
          [
            {
              id: 1,
              name: "John",
              email: "wick@co.org",
              type: "admin",
            },
          ],
          200
        )
      ),
      400: badRequest("user already admin"),
      500: serverErr(),
    },
  }),
  userToAdmin as any
);

export default adminRouter;
