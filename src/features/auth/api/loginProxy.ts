import { NextRequest, NextResponse } from "next/server";
import { API_URL, DEFAULT_EXPIRES_IN_MINS } from "@/shared/config/env";
import { loginCredentialsSchema, SessionUser } from "@/entities/session";
import { ApiError, ValidationError } from "@/shared/lib/error";
import { handleApiError } from "@/shared/api/handleApiError";

export async function proxyLogin(request: NextRequest): Promise<NextResponse> {
  try {
    const credentials = await request.json();

    const result = loginCredentialsSchema.safeParse(credentials);
    if (!result.success) {
      throw new ValidationError(result.error);
    }

    const body = {
      username: result.data.username,
      password: result.data.password,
      expiresInMins: DEFAULT_EXPIRES_IN_MINS,
    };

    let response: Response;
    try {
      response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
    } catch {
      throw new ApiError(503, "Upstream service unavailable");
    }

    const data: SessionUser = await response.json();

    if (!response.ok) {
      throw new ApiError(response.status, "Login failed");
    }

    const { refreshToken, ...clientData } = data;

    const nextResponse = NextResponse.json(clientData);

    nextResponse.cookies.set("refreshToken", refreshToken, {
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
