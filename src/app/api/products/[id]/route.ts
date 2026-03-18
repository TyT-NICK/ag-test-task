import { NextRequest } from "next/server";
import { proxyProduct } from "@/features/products";

export const GET = (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => proxyProduct(request, params);
