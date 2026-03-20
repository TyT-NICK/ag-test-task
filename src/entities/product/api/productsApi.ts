import { client } from "@/shared/api";
import type { Product, ProductsResponse } from "../model/types";
import type { productBodySchema } from "../model/schema";
import type { z } from "zod";

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

export async function addProduct(
  body: z.output<typeof productBodySchema>,
): Promise<Product> {
  const { data } = await client.post<Product>("/products", body);
  return data;
}

export async function updateProduct(
  id: number,
  body: Partial<z.output<typeof productBodySchema>>,
): Promise<Product> {
  const { data } = await client.put<Product>(`/products/${id}`, body);
  return data;
}
