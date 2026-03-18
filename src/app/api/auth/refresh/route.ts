import { NextRequest } from "next/server";
import { proxyRefresh } from "@/features/auth";

export const POST = (request: NextRequest) => proxyRefresh(request);
