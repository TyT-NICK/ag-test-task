import type { NextResponse } from "next/server";
import { DEFAULT_EXPIRES_IN_MINS } from "@/shared/config/env";

const cookieBase = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

export function setAuthCookies(
  response: NextResponse,
  tokens: { accessToken: string; refreshToken: string },
  persist: boolean,
) {
  response.cookies.set("accessToken", tokens.accessToken, {
    ...cookieBase,
    ...(persist && { maxAge: DEFAULT_EXPIRES_IN_MINS * 60 }),
  });
  response.cookies.set("refreshToken", tokens.refreshToken, {
    ...cookieBase,
    ...(persist && { maxAge: 60 * 60 * 24 * 7 }), // 7 days
  });
  // Non-sensitive flag so refreshProxy can preserve the original choice
  response.cookies.set("persist", persist ? "1" : "", {
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    ...(persist && { maxAge: 60 * 60 * 24 * 7 }),
  });
}
