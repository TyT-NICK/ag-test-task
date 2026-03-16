import { NextRequest, NextResponse } from "next/server";
import { proxyLogin } from "@/src/features/auth";
import { handleApiError } from "@/src/shared/api/handleApiError";

export async function POST(request: NextRequest) {
  try {
    const credentials = await request.json();
    const user = await proxyLogin(credentials);

    return NextResponse.json(user);
  } catch (error) {
    return handleApiError(error);
  }
}
