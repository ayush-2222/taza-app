import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type UserRole = "user" | "admin";

export type UserProfile = {
  id?: string;
  name: string;
  email?: string | null;
  phoneNumber?: string | null;
  city?: string | null;
  state?: string | null;
  location?: string | null;
  preferredCategory?: string | null;
  role: UserRole;
};

type LoginPayload = {
  id?: string;
  name?: string;
  email?: string | null;
  phoneNumber?: string | null;
  city?: string | null;
  state?: string | null;
  location?: string | null;
  preferredCategory?: string | null;
  role?: UserRole;
};

type AuthState = {
  isAuthenticated: boolean;
  isGuest: boolean;
  user: UserProfile | null;
  signupPromptDismissed: number;
  promptLocked: boolean;
  login: (payload: LoginPayload) => void;
  continueAsGuest: (location?: string | null) => void;
  logout: () => void;
  updateProfile: (payload: Partial<UserProfile>) => void;
  setLocation: (location?: string | null) => void;
  dismissSignupPrompt: () => void;
  enforceSignupPrompt: () => void;
  resetSignupPrompt: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isGuest: true,
      user: null,
      signupPromptDismissed: 0,
      promptLocked: false,
      login: (payload) =>
        set({
          isAuthenticated: true,
          isGuest: false,
          promptLocked: false,
          signupPromptDismissed: 0,
          user: {
            id: payload.id,
            name: payload.name ?? "Taaza User",
            email: payload.email ?? null,
            phoneNumber: payload.phoneNumber ?? null,
            city: payload.city ?? null,
            state: payload.state ?? null,
            location: payload.location ?? null,
            preferredCategory: payload.preferredCategory ?? null,
            role: payload.role ?? "user"
          }
        }),
      continueAsGuest: (location) =>
        set((state) => ({
          isAuthenticated: false,
          isGuest: true,
          user: state.user ?? {
            name: "Guest User",
            location: location ?? null,
            role: "user"
          }
        })),
      logout: () =>
        set((state) => ({
          isAuthenticated: false,
          isGuest: true,
          promptLocked: false,
          signupPromptDismissed: 0,
          user: state.user
            ? {
                ...state.user,
                email: null,
                phoneNumber: null,
                state: null,
                role: "user"
              }
            : {
                name: "Guest User",
                role: "user"
              }
        })),
      updateProfile: (payload) =>
        set((state) => ({
          user: {
            ...(state.user ?? { name: "Guest User", role: "user" }),
            ...payload
          }
        })),
      setLocation: (location) =>
        set((state) => ({
          user: {
            ...(state.user ?? { name: "Guest User", role: "user" }),
            location: location ?? null
          }
        })),
      dismissSignupPrompt: () =>
        set((state) => ({
          signupPromptDismissed: state.signupPromptDismissed + 1
        })),
      enforceSignupPrompt: () => set({ promptLocked: true }),
      resetSignupPrompt: () => set({ promptLocked: false, signupPromptDismissed: 0 })
    }),
    {
      name: "taza-auth",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
