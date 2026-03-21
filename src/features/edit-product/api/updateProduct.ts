import { Product, ProductBodyValues } from "@/entities/product";
import { client } from "@/shared/api";

export async function updateProduct(
  id: number,
  body: Partial<ProductBodyValues>,
): Promise<Product> {
  const { data } = await client.put<Product>(`/products/${id}`, body);
  return data;
}
