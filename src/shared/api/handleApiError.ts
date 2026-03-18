import { NextResponse } from "next/server";
import { AppError, ValidationError } from "../lib/error";

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ValidationError) {
    return NextResponse.json(
      { error: error.code, message: error.message, fields: error.fields },
      { status: error.status },
    );
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.code, message: error.message },
      { status: error.status },
    );
  }

  console.error("[Unhandled error]", error);

  return NextResponse.json(
    { error: "INTERNAL_ERROR", message: "Something went wrong" },
    { status: 500 },
  );
}
