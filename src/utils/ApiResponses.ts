class ApiResponse<T> {
  data: T;
  statusCode?: number;
  message?: string;
  success?: boolean;
  constructor(data: T, statusCode = 200, message = "success") {
    this.data = data;
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode < 400;
  }
}

class ApiError extends Error {
  data: null;
  statusCode?: number;
  message: string;
  success?: boolean;
  stack?: string;
  errors: any[];

  constructor(message: string, statusCode = 500, errors = [], stack = "") {
    super(message);
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;
    this.statusCode = statusCode;

    if (stack) {
      this.stack = "";
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiResponse, ApiError };
