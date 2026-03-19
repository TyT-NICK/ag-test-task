import { client } from "@/shared/api";
import type { ProductsResponse } from "@/entities/product";

export interface ProductsParams {
  limit?: number;
  skip?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  q?: string;
}

export async function fetchProducts(
  params: ProductsParams,
): Promise<ProductsResponse> {
  const { data } = await client.get<ProductsResponse>("/products", { params });
  return data;
}
