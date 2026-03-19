export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? `https://${process.env.VERCEL_URL}`;
export const API_URL = process.env.API_URL ?? "";
export const DEFAULT_EXPIRES_IN_MINS = 30;
export const DEFAULT_PRODUCTS_LIMIT = 20;
