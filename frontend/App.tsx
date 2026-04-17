import 'react-native-reanimated';
import "react-native-gesture-handler";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { getThemeTokens } from "./src/constants/theme";
import { useThemeStore } from "./src/store/themeStore";
import { useAuthStore } from "./src/store/authStore";
import { userService } from "./src/services/userService";

export default function App() {
  const mode = useThemeStore((state) => state.mode);
  const { colors } = getThemeTokens(mode);
  const setLocation = useAuthStore((state) => state.setLocation);
  const user = useAuthStore((state) => state.user);
  const appTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      notification: colors.secondary
    }
  };

  useEffect(() => {
    async function bootstrapLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          return;
        }

        const current = await Location.getCurrentPositionAsync({});
        const [details] = await Location.reverseGeocodeAsync(current.coords);
        const locationLabel = [details.city, details.region].filter(Boolean).join(", ");
        if (!locationLabel) {
          return;
        }

        setLocation(locationLabel);

        if (details.region && user?.id) {
          await userService.saveLocation({
            userId: user?.id,
            name: user?.name,
            email: user?.email ?? undefined,
            phoneNumber: user?.phoneNumber ?? undefined,
            city: details.city ?? undefined,
            state: details.region,
            location: locationLabel
          });
        }
      } catch {
        // Location is a progressive enhancement and should never block app startup.
      }
    }

    bootstrapLocation();
  }, [setLocation, user?.email, user?.id, user?.name, user?.phoneNumber]);

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={appTheme}>
        <StatusBar style={mode === "dark" ? "light" : "dark"} />
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
