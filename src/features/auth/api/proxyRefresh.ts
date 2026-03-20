import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/shared/config/env";
import type { SessionUser } from "../model/types";
import { ApiError } from "@/shared/lib/error";
import { handleApiError } from "@/shared/api/handleApiError";
import { setAuthCookies } from "./setAuthCookies";

export async function proxyRefresh(request: NextRequest): Promise<NextResponse> {
  try {
    const refreshTokenCookie = request.cookies.get("refreshToken");

    if (!refreshTokenCookie?.value) {
      throw new ApiError(401, "No refresh token");
    }

    // Preserve the original persistence choice recorded at login
    const persist = request.cookies.get("persist")?.value === "1";

    let response: Response;
    try {
      response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: refreshTokenCookie.value }),
      });
    } catch {
      throw new ApiError(503, "Upstream service unavailable");
    }

    const data: SessionUser = await response.json();

    if (!response.ok) {
      throw new ApiError(response.status, "Token refresh failed");
    }

    const { accessToken, refreshToken: newRefreshToken, ...profile } = data;

    const nextResponse = NextResponse.json(profile);
    setAuthCookies(nextResponse, { accessToken, refreshToken: newRefreshToken }, persist);

    return nextResponse;
  } catch (error) {
    return handleApiError(error);
  }
}
