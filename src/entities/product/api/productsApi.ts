import { client } from "@/shared/api";
import type { Product, ProductsResponse } from "../model/types";

export interface ProductsParams {
  limit?: number;
  skip?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  q?: string;
}

export async function fetchProduct(id: number): Promise<Product> {
  const { data } = await client.get<Product>(`/products/${id}`);
  return data;
}

export async function fetchProducts(
  params: ProductsParams,
): Promise<ProductsResponse> {
  const { data } = await client.get<ProductsResponse>("/products", { params });
  return data;
}
