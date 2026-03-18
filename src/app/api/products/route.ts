import { NextRequest } from "next/server";
import { proxyProducts } from "@/features/products";

export const GET = (request: NextRequest) => proxyProducts(request);
