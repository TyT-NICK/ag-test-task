import { NextResponse } from "next/server";
import { AppError } from "../lib/error";

export function handleApiError(error: unknown): NextResponse {
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
