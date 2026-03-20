import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { API_URL } from "@/shared/config/env";
import type { Product } from "../model/types";
import { productBodySchema } from "../model/schema";
import { ApiError, ValidationError } from "@/shared/lib/error";
import { handleApiError } from "@/shared/api/handleApiError";

const paramsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export async function proxyUpdateProduct(
  request: NextRequest,
  params: Promise<{ id: string }>,
): Promise<NextResponse> {
  try {
    const paramsResult = paramsSchema.safeParse(await params);

    if (!paramsResult.success) {
      throw new ValidationError(paramsResult.error);
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new ValidationError(new Error("Invalid JSON body") as never);
    }

    const bodyResult = productBodySchema.partial().safeParse(body);

    if (!bodyResult.success) {
      throw new ValidationError(bodyResult.error);
    }

    let response: Response;
    try {
      response = await fetch(`${API_URL}/products/${paramsResult.data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyResult.data),
      });
    } catch {
      throw new ApiError(503, "Upstream service unavailable");
    }

    if (!response.ok) {
      throw new ApiError(response.status, "Failed to update product");
    }

    const data: Product = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
