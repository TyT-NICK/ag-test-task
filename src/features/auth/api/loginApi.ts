import { client } from "@/shared/api";
import type { SessionUser } from "../model/types";

export type LoginRequest = {
  username: string;
  password: string;
  rememberMe: boolean;
};

export type LoginResponse = Omit<SessionUser, "accessToken" | "refreshToken">;

export async function loginApi(data: LoginRequest): Promise<LoginResponse> {
  const response = await client.post<LoginResponse>("/auth/login", data);
  return response.data;
}
