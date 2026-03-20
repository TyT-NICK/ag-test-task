import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/shared/config/env";
import type { Product } from "../model/types";
import { productBodySchema } from "../model/schema";
import { ApiError, ValidationError } from "@/shared/lib/error";
import { handleApiError } from "@/shared/api/handleApiError";

export async function proxyAddProduct(
  request: NextRequest,
): Promise<NextResponse> {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new ValidationError(new Error("Invalid JSON body") as never);
    }

    const result = productBodySchema.safeParse(body);

    if (!result.success) {
      throw new ValidationError(result.error);
    }

    let response: Response;
    try {
      response = await fetch(`${API_URL}/products/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
    } catch {
      throw new ApiError(503, "Upstream service unavailable");
    }

    if (!response.ok) {
      throw new ApiError(response.status, "Failed to add product");
    }

    const data: Product = await response.json();

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
