import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/shared/config/env";
import type { SessionUser } from "../model/types";
import { ApiError } from "@/shared/lib/error";
import { handleApiError } from "@/shared/api/handleApiError";

export async function proxyMe(request: NextRequest): Promise<NextResponse> {
  try {
    const accessToken = request.cookies.get("accessToken")?.value;

    if (!accessToken) {
      throw new ApiError(401, "Unauthorized");
    }

    let response: Response;
    try {
      response = await fetch(`${API_URL}/auth/me`, {
        headers: { authorization: `Bearer ${accessToken}` },
      });
    } catch {
      throw new ApiError(503, "Upstream service unavailable");
    }

    if (!response.ok) {
      throw new ApiError(response.status, "Failed to fetch user");
    }

    const data: Omit<SessionUser, "accessToken" | "refreshToken"> =
      await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
