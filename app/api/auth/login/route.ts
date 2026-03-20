import { NextRequest } from "next/server";
import { proxyLogin } from "@/features/auth";

export const POST = (request: NextRequest) => proxyLogin(request);
