import axios, { type InternalAxiosRequestConfig } from "axios";
import { BASE_URL } from "../config/env";

export const client = axios.create({
  baseURL: BASE_URL + "/api",
  withCredentials: true, // send HttpOnly cookies on every request
});

/* ── 401 → refresh → retry ─────────────────────────────────── */

type FailedRequest = {
  resolve: () => void;
  reject: (err: unknown) => void;
};

let isRefreshing = false;
let queue: FailedRequest[] = [];

function flushQueue(error?: unknown) {
  queue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve()));
  queue = [];
}

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original: InternalAxiosRequestConfig & { _retry?: boolean } =
      error.config;

    if (
      error.response?.status !== 401 ||
      original._retry ||
      original.url === "/auth/login"
    ) {
      return Promise.reject(error);
    }

    // Queue concurrent 401s while a refresh is already in flight
    if (isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then(() => client(original));
    }

    original._retry = true;
    isRefreshing = true;

    try {
      await client.post("/auth/refresh");
      flushQueue();
      return client(original);
    } catch (refreshError) {
      flushQueue(refreshError);
      window.location.href = "/ru/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
