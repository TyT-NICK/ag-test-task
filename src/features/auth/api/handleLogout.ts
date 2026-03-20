import { NextResponse } from "next/server";

export function handleLogout(): NextResponse {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");
  response.cookies.delete("persist");
  return response;
}
