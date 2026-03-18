import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/shared/config/env";
import { SessionUser } from "@/entities/session";
import { ApiError } from "@/shared/lib/error";
import { handleApiError } from "@/shared/api/handleApiError";

export async function proxyRefresh(request: NextRequest): Promise<NextResponse> {
  try {
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      throw new ApiError(401, "No refresh token");
    }

    let response: Response;
    try {
      response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      throw new ApiError(503, "Upstream service unavailable");
    }

    const data: SessionUser = await response.json();

    if (!response.ok) {
      throw new ApiError(response.status, "Token refresh failed");
    }

    const { refreshToken: newRefreshToken, ...clientData } = data;

    const nextResponse = NextResponse.json(clientData);
    nextResponse.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return nextResponse;
  } catch (error) {
    return handleApiError(error);
  }
}
