import type { Context } from "hono";

type ResponseT<T> = {
  success: boolean;
  code?: number;
  statusCode: number;
  message: string;
  data: T;
};

type RegisteUser = {
  email: string;
  name?: string;
  password: string;
};

type TokenType = {
  id: string | number;
  email: string;
};

interface UserContext extends Context {
  user?: TokenType;
}
