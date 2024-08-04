const STATUS = {
  ok: 200,
  creation: 201,
  badRequest: 400,
  forbidden: 401,
  notFound: 404,
  unprocessable: 422,
  serverErr: 500,
} satisfies { [x: string]: number };

export default STATUS;
