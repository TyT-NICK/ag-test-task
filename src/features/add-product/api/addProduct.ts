import { Product, ProductBodyValues } from "@/entities/product";
import { client } from "@/shared/api";

export async function addProduct(body: ProductBodyValues): Promise<Product> {
  const { data } = await client.post<Product>("/products", body);
  return data;
}
