import z, { ZodError } from "zod";

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
    super("ApiError", status, message);
  }
}

export class ValidationError extends AppError {
  fields: unknown;

  constructor(public readonly error: ZodError) {
    super("VALIDATION_ERROR", 422, "Validation failed");
    this.fields = z.treeifyError(error);
  }
}
