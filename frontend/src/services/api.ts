import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { mobileEnv } from "@/config/env";

export const api = axios.create({
  baseURL: mobileEnv.apiBaseUrl,
  timeout: 8000,
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
  (error) => {
    if (!mobileEnv.apiBaseUrl) {
      error.message = "API base URL is not configured. Set EXPO_PUBLIC_API_BASE_URL before running the app.";
    }

    return Promise.reject(error);
  }
);
