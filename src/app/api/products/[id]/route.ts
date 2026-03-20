import { NextRequest } from "next/server";
import { proxyProduct, proxyUpdateProduct } from "@/entities/product";

export const GET = (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => proxyProduct(request, params);

export const PUT = (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => proxyUpdateProduct(request, params);
