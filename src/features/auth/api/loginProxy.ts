import { API_URL } from "@/src/shared/config/env";
import type { LoginCredentials, SessionUser } from "@/src/entities/session";
import { ApiError } from "next/dist/server/api-utils";

export async function proxyLogin(
  credentials: LoginCredentials,
): Promise<SessionUser> {
  const body: Record<string, unknown> = {
    username: credentials.username,
    password: credentials.password,
  };

  if (credentials.expiresInMins !== undefined) {
    body.expiresInMins = credentials.expiresInMins;
  }

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

  const data = await response.json().catch(() => {
    throw new ApiError(502, "Invalid response from upstream");
  });

  if (!response.ok) {
    throw new ApiError(response.status, data.message ?? "Login failed");
  }

  return data as SessionUser;
}
