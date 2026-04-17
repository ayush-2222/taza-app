import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { mobileEnv } from "@/config/env";

const BASE_URL = mobileEnv.apiBaseUrl;

console.log("[api] Using base URL:", BASE_URL);

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const state = useAuthStore.getState();
  const userId = state.user?.id;
  const userState = state.user?.state ?? undefined;

  config.headers = config.headers ?? {};
  if (userId) {
    config.headers["x-user-id"] = userId;
  }
  if (userState) {
    config.headers["x-user-state"] = userState;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);
