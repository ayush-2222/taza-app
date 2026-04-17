import { getThemeTokens } from "@/constants/theme";
import { useThemeStore } from "@/store/themeStore";

export function useTheme() {
  const mode = useThemeStore((state) => state.mode);
  return {
    mode,
    ...getThemeTokens(mode)
  };
}
