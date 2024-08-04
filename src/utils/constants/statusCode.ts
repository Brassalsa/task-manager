const STATUS = {
  ok: 200,
  creation: 201,
  serverErr: 500,
  notFound: 404,
  badRequest: 400,
  forbidden: 401,
  unprocessable: 422,
} satisfies { [x: string]: number };

export default STATUS;
