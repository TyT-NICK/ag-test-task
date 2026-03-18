import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { API_URL } from "@/shared/config/env";
import type { Product } from "@/entities/product";
import { ApiError, ValidationError } from "@/shared/lib/error";
import { handleApiError } from "@/shared/api/handleApiError";

const paramsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export async function proxyProduct(
  request: NextRequest,
  params: Promise<{ id: string }>,
): Promise<NextResponse> {
  try {
    const accessToken = request.cookies.get("accessToken")?.value;

    if (!accessToken) {
      throw new ApiError(401, "Unauthorized");
    }

    const result = paramsSchema.safeParse(await params);

    if (!result.success) {
      throw new ValidationError(result.error);
    }

    let response: Response;
    try {
      response = await fetch(`${API_URL}/products/${result.data.id}`, {
        headers: { authorization: `Bearer ${accessToken}` },
      });
    } catch {
      throw new ApiError(503, "Upstream service unavailable");
    }

    if (!response.ok) {
      throw new ApiError(response.status, "Failed to fetch product");
    }

    const data: Product = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
