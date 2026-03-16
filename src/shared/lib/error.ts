export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

export class ApiError extends AppError {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super('ApiError', status, message);
  }
}