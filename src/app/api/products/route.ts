import { NextRequest } from "next/server";
import { proxyProducts, proxyAddProduct } from "@/entities/product";

export const GET = (request: NextRequest) => proxyProducts(request);
export const POST = (request: NextRequest) => proxyAddProduct(request);
