class ApiResponse {
  constructor(code, data, message) {
    (this.statusCode = code),
      (this.data = data),
      (this.message = message),
      (this.success = code < 400 ? true : false);
  }
}

export { ApiResponse };
