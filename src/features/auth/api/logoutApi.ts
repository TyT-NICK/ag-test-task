import { client } from "@/shared/api";

export async function logoutApi(): Promise<void> {
  await client.post("/auth/logout");
}
