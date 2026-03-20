import { client } from "@/shared/api";
import type { SessionUser } from "../model/types";

export type MeResponse = Omit<SessionUser, "accessToken" | "refreshToken">;

export async function fetchMe(): Promise<MeResponse> {
  const { data } = await client.get<MeResponse>("/auth/me");
  return data;
}
