import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ThemeMode } from "@/constants/theme";

type ThemeState = {
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: "light",
      toggleMode: () =>
        set((state) => ({
          mode: state.mode === "light" ? "dark" : "light"
        })),
      setMode: (mode) => set({ mode })
    }),
    {
      name: "taza-theme",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
