export const lightColors = {
  background: "#F5F7FB",
  backgroundAlt: "#FFFFFF",
  card: "#FFFFFF",
  surface: "#EEF2F8",
  primary: "#E55228",
  secondary: "#0F8B8D",
  text: "#111827",
  textMuted: "#6B7280",
  border: "#E5E7EB",
  danger: "#DC2626",
  shadow: "rgba(15, 23, 42, 0.08)",
};

export const darkColors = {
  background: "#09111B",
  backgroundAlt: "#101B2A",
  card: "#132235",
  surface: "#1B2D45",
  primary: "#FF7A3D",
  secondary: "#33D2B9",
  text: "#F4F7FB",
  textMuted: "#A6B5C8",
  border: "#24364F",
  danger: "#FF6B6B",
  shadow: "rgba(0, 0, 0, 0.28)",
};

export const colors = lightColors;

export const lightGradients = {
  screen: ["#F8FAFD", "#F3F6FB", "#EDF2F8"] as const,
  hero: ["#FFF0E9", "#FFE5D7"] as const,
  accent: ["#DBF5F0", "#D6EFF4"] as const,
};

export const darkGradients = {
  screen: ["#09111B", "#122033", "#0B1625"] as const,
  hero: ["#FF7A3D", "#FF9A62"] as const,
  accent: ["#2ED3B7", "#1D8BA5"] as const,
};

export const gradients = lightGradients;

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const radii = {
  sm: 12,
  md: 18,
  lg: 24,
  pill: 999,
};

export const navigationTheme = {
  colors: {
    primary: lightColors.primary,
    background: lightColors.background,
    card: lightColors.card,
    text: lightColors.text,
    border: lightColors.border,
    notification: lightColors.secondary,
  }
};

export type ThemeMode = "light" | "dark";
export type AppColors = typeof lightColors;
export type AppGradients = typeof lightGradients;

export function getThemeTokens(mode: ThemeMode) {
  return {
    colors: mode === "dark" ? darkColors : lightColors,
    gradients: mode === "dark" ? darkGradients : lightGradients,
    isDark: mode === "dark"
  };
}
