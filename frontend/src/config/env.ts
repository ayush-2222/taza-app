function normalizeUrl(value?: string) {
  const trimmed = value?.trim();
  if (!trimmed) {
    return undefined;
  }

  return trimmed.replace(/\/+$/, "");
}

const DEFAULT_API_BASE_URL = "https://taza-app.onrender.com";
const apiBaseUrl = normalizeUrl(process.env.EXPO_PUBLIC_API_BASE_URL) ?? DEFAULT_API_BASE_URL;

export const mobileEnv = {
  apiBaseUrl,
  demoLogin:
    process.env.EXPO_PUBLIC_DEMO_LOGIN_IDENTIFIER && process.env.EXPO_PUBLIC_DEMO_LOGIN_PASSWORD
      ? {
          identifier: process.env.EXPO_PUBLIC_DEMO_LOGIN_IDENTIFIER,
          password: process.env.EXPO_PUBLIC_DEMO_LOGIN_PASSWORD
        }
      : null,
  adminLogin:
    process.env.EXPO_PUBLIC_ADMIN_LOGIN_IDENTIFIER && process.env.EXPO_PUBLIC_ADMIN_LOGIN_PASSWORD
      ? {
          identifier: process.env.EXPO_PUBLIC_ADMIN_LOGIN_IDENTIFIER,
          password: process.env.EXPO_PUBLIC_ADMIN_LOGIN_PASSWORD
        }
      : null
};
