import { proxyProducts } from "@/entities/product";
import { proxyAddProduct } from "@/features/add-product";

export const GET = proxyProducts;
export const POST = proxyAddProduct;
