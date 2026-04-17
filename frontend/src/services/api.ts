import axios from "axios";
import { useAuthStore } from "@/store/authStore";

export const api = axios.create({
  baseURL: "http://192.168.0.138:8000",
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

