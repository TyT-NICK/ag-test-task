import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { API_URL, DEFAULT_EXPIRES_IN_MINS } from "@/shared/config/env";
import { loginCredentialsSchema } from "../model/schema";
import type { SessionUser } from "../model/types";
import { ApiError, ValidationError } from "@/shared/lib/error";
import { handleApiError } from "@/shared/api/handleApiError";
import { setAuthCookies } from "./setAuthCookies";

const loginRequestSchema = loginCredentialsSchema.extend({
  rememberMe: z.boolean().optional().default(false),
});

export async function proxyLogin(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    const result = loginRequestSchema.safeParse(body);
    if (!result.success) {
      throw new ValidationError(result.error);
    }

    const { rememberMe, ...credentials } = result.data;

    let response: Response;
    try {
      response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...credentials, expiresInMins: DEFAULT_EXPIRES_IN_MINS }),
      });
    } catch {
      throw new ApiError(503, "Upstream service unavailable");
    }

    const data: SessionUser = await response.json();

    if (!response.ok) {
      throw new ApiError(401, "Login failed");
    }

    const { accessToken, refreshToken, ...profile } = data;

    const nextResponse = NextResponse.json(profile);
    setAuthCookies(nextResponse, { accessToken, refreshToken }, rememberMe);

    return nextResponse;
  } catch (error) {
    return handleApiError(error);
  }
}
