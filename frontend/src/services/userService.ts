import { api } from "./api";

type AuthPayload = {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  location?: string;
  city?: string;
  state?: string;
};

type LoginPayload = {
  identifier: string;
  password: string;
};

type ProfilePayload = {
  name?: string;
  location?: string;
  city?: string;
  state?: string;
  preferredCategory?: string;
};

type PasswordPayload = {
  currentPassword: string;
  nextPassword: string;
};

export type AdminUser = {
  id: string;
  name: string;
  email?: string | null;
  phoneNumber?: string | null;
  city?: string | null;
  state?: string | null;
  location?: string | null;
  role: "user" | "admin";
  preferredCategory?: string | null;
  isGuest: boolean;
  createdAt: string;
  updatedAt: string;
};

export const userService = {
  async signup(payload: AuthPayload) {
    const response = await api.post("/auth/signup", payload);
    return response.data;
  },

  async login(payload: LoginPayload) {
    const response = await api.post("/auth/login", payload);
    return response.data;
  },

  async updateProfile(userId: string, payload: ProfilePayload) {
    const response = await api.patch(`/users/profile/${userId}`, payload);
    return response.data;
  },

  async changePassword(userId: string, payload: PasswordPayload) {
    const response = await api.patch(`/users/password/${userId}`, payload);
    return response.data;
  },

  async saveLocation(payload: {
    userId?: string;
    name?: string;
    email?: string;
    phoneNumber?: string;
    city?: string;
    state: string;
    location?: string;
    isGuest?: boolean;
  }) {
    const response = await api.post("/users/location", payload);
    return response.data;
  },

  async getRegisteredUsers() {
    const response = await api.get<AdminUser[]>("/admin/users");
    return response.data;
  }
};
