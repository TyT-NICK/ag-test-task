import { NextRequest } from "next/server";
import { proxyMe } from "@/features/auth";

export const GET = (request: NextRequest) => proxyMe(request);
