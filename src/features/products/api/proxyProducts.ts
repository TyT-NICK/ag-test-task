import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { API_URL, DEFAULT_PRODUCTS_LIMIT } from "@/shared/config/env";
import type { ProductsResponse } from "@/entities/product";
import { ApiError, ValidationError } from "@/shared/lib/error";
import { handleApiError } from "@/shared/api/handleApiError";

const productsQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(DEFAULT_PRODUCTS_LIMIT),
  skip: z.coerce.number().int().min(0).default(0),
  sortBy: z
    .enum(["id", "title", "price", "rating", "stock", "discountPercentage"])
    .optional(),
  order: z.enum(["asc", "desc"]).optional(),
  q: z.string().optional(),
});

export async function proxyProducts(
  request: NextRequest,
): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const result = productsQuerySchema.safeParse(
      Object.fromEntries(searchParams),
    );

    if (!result.success) {
      throw new ValidationError(result.error);
    }

    const { limit, skip, sortBy, order, q } = result.data;

    const params = new URLSearchParams();
    params.set("limit", String(limit));
    params.set("skip", String(skip));
    if (sortBy) params.set("sortBy", sortBy);
    if (order) params.set("order", order);

    const upstreamPath = q
      ? `/products/search?q=${encodeURIComponent(q)}&${params}`
      : `/products?${params}`;

    let response: Response;
    try {
      response = await fetch(`${API_URL}${upstreamPath}`);
    } catch {
      throw new ApiError(503, "Upstream service unavailable");
    }

    if (!response.ok) {
      throw new ApiError(response.status, "Failed to fetch products");
    }

    const data: ProductsResponse = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
