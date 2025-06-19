class ApiError extends Error {
  constructor(status, message = "something went wrong", stack, error = []) {
    super(message);
    (this.status = status),
      (this.message = message),
      (this.error = error),
      (this.success = false);

    if (stack) this.stack = stack;
    else {
      this.stack = Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
