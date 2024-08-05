import type { Context, Env, Input } from "hono";

type ResponseT<T> = {
  success: boolean;
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
  id: number;
  email: string;
};

type UserContext = Context<
  ENV & {
    user: TokenType;
  },
  string,
  Input
> & {
  user?: TokenType;
};
