import { useEffect, useMemo, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { radii } from "@/constants/theme";
import { Screen } from "@/components/Screen";
import { useTheme } from "@/hooks/useTheme";
import { useAuthStore } from "@/store/authStore";
import { userService } from "@/services/userService";
import { RootStackParamList } from "@/navigation/types";
import { UserRole } from "@/store/authStore";
import { mobileEnv } from "@/config/env";

type AuthResponse = {
  id?: string;
  name?: string;
  email?: string | null;
  phoneNumber?: string | null;
  state?: string | null;
  location?: string | null;
  preferredCategory?: string | null;
  role?: UserRole;
};

export function AuthScreen() {
  const { colors, gradients } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "Auth">>();
  const login = useAuthStore((state) => state.login);
  const continueAsGuest = useAuthStore((state) => state.continueAsGuest);
  const user = useAuthStore((state) => state.user);
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? "");
  const [location, setLocation] = useState(user?.location ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (route.params?.mode === "signup") {
      setIsSignup(true);
    } else if (route.params?.mode === "login") {
      setIsSignup(false);
    }
  }, [route.params?.mode]);

  const identifierPlaceholder = useMemo(
    () => "Email or phone number",
    []
  );

  const completeLogin = (response: AuthResponse) => {
    login({
      id: response.id,
      name: response.name,
      email: response.email,
      phoneNumber: response.phoneNumber,
      state: response.state,
      location: response.location,
      preferredCategory: response.preferredCategory,
      role: response.role
    });

    if (response.role === "admin") {
      navigation.reset({
        index: 1,
        routes: [{ name: "MainTabs" }, { name: "AdminUsers" }]
      });
      return;
    }

    navigation.reset({
      index: 0,
      routes: [{ name: "MainTabs" }]
    });
  };

  const handleGuestContinue = () => {
    continueAsGuest(location);
    navigation.reset({
      index: 0,
      routes: [{ name: "MainTabs" }]
    });
  };

  const handleQuickLogin = async (identifier: string, passwordValue: string) => {
    setIsSignup(false);
    setEmail(identifier);
    setPassword(passwordValue);

    try {
      const response = await userService.login({ identifier, password: passwordValue });
      completeLogin(response);
    } catch {
      Alert.alert("Quick login failed", "Unable to sign in with those credentials.");
    }
  };

  const handleSubmit = async () => {
    try {
      if (isSignup) {
        if (!name || !email || !phoneNumber || !password || !confirmPassword) {
          Alert.alert("Missing details", "Please complete all signup fields.");
          return;
        }

        if (password !== confirmPassword) {
          Alert.alert("Password mismatch", "Confirm password should match the password field.");
          return;
        }

        const response = await userService.signup({
          name,
          email,
          phoneNumber,
          password,
          confirmPassword,
          location
        });

        completeLogin(response);
        return;
      }

      if (!email || !password) {
        Alert.alert("Missing details", "Please enter your email or phone number and password.");
        return;
      }

      const response = await userService.login({ identifier: email, password });
      completeLogin(response);
    } catch (error) {
      Alert.alert("Auth issue", error instanceof Error ? error.message : "Please try again.");
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
          <Animated.View entering={FadeInUp.duration(700)} style={[styles.heroCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <LinearGradient colors={[...gradients.hero]} style={styles.badge}>
              <Text style={[styles.badgeText, { color: colors.primary }]}>Taaza TV Access</Text>
            </LinearGradient>
            <Text style={[styles.title, { color: colors.text }]}>Stay in the loop, your way</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              Browse as a guest, or sign in to post, save preferences, and unlock a smoother news experience.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(120).duration(700)} style={[styles.form, { backgroundColor: colors.backgroundAlt, borderColor: colors.border }]}>
            <Text style={[styles.switchLabel, { color: colors.text }]}>{isSignup ? "Create account" : "Welcome back"}</Text>
            {isSignup ? (
              <TextInput
                placeholder="Name"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                value={name}
                onChangeText={setName}
              />
            ) : null}
            <TextInput
              autoCapitalize="none"
              placeholder={isSignup ? "Email" : identifierPlaceholder}
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              value={email}
              onChangeText={setEmail}
            />
            {isSignup ? (
              <>
                <TextInput
                  keyboardType="phone-pad"
                  placeholder="Phone number"
                  placeholderTextColor={colors.textMuted}
                  style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
                <TextInput
                  placeholder="Location"
                  placeholderTextColor={colors.textMuted}
                  style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                  value={location}
                  onChangeText={setLocation}
                />
              </>
            ) : null}
            <View style={[styles.passwordRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TextInput
                secureTextEntry={!showPassword}
                placeholder="Password"
                placeholderTextColor={colors.textMuted}
                style={[styles.passwordInput, { color: colors.text }]}
                value={password}
                onChangeText={setPassword}
              />
              <Pressable onPress={() => setShowPassword((value) => !value)}>
                <Text style={[styles.toggleText, { color: colors.secondary }]}>{showPassword ? "Hide" : "Show"}</Text>
              </Pressable>
            </View>
            {isSignup ? (
              <View style={[styles.passwordRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <TextInput
                  secureTextEntry={!showConfirmPassword}
                  placeholder="Confirm password"
                  placeholderTextColor={colors.textMuted}
                  style={[styles.passwordInput, { color: colors.text }]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <Pressable onPress={() => setShowConfirmPassword((value) => !value)}>
                  <Text style={[styles.toggleText, { color: colors.secondary }]}>
                    {showConfirmPassword ? "Hide" : "Show"}
                  </Text>
                </Pressable>
              </View>
            ) : null}
            <Pressable onPress={handleSubmit} style={[styles.primaryButton, { backgroundColor: colors.primary }]}>
              <Text style={[styles.primaryText, { color: colors.backgroundAlt }]}>{isSignup ? "Sign up" : "Login"}</Text>
            </Pressable>
            {!isSignup && (mobileEnv.demoLogin || mobileEnv.adminLogin) ? (
              <View style={styles.quickRow}>
                {mobileEnv.demoLogin ? (
                  <Pressable
                    onPress={() => handleQuickLogin(mobileEnv.demoLogin!.identifier, mobileEnv.demoLogin!.password)}
                    style={[styles.quickButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  >
                    <Text style={[styles.quickButtonText, { color: colors.text }]}>Demo login</Text>
                  </Pressable>
                ) : null}
                {mobileEnv.adminLogin ? (
                  <Pressable
                    onPress={() => handleQuickLogin(mobileEnv.adminLogin!.identifier, mobileEnv.adminLogin!.password)}
                    style={[styles.quickButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  >
                    <Text style={[styles.quickButtonText, { color: colors.text }]}>Admin login</Text>
                  </Pressable>
                ) : null}
              </View>
            ) : null}
            <Pressable onPress={handleGuestContinue}>
              <Text style={[styles.secondaryText, { color: colors.textMuted }]}>Continue as guest</Text>
            </Pressable>
            <Pressable onPress={() => setIsSignup((value) => !value)}>
              <Text style={[styles.secondaryText, { color: colors.secondary }]}>
                {isSignup ? "Already have an account? Login" : "New here? Create account"}
              </Text>
            </Pressable>
          </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1
  },
  scroll: {
    flexGrow: 1
  },
  container: {
    flex: 1,
    justifyContent: "center",
    gap: 24,
    paddingVertical: 24
  },
  heroCard: {
    borderRadius: radii.lg,
    padding: 24,
    borderWidth: 1
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 20
  },
  badgeText: {
    fontWeight: "800"
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 38
  },
  subtitle: {
    marginTop: 12,
    lineHeight: 22
  },
  form: {
    borderRadius: radii.lg,
    padding: 20,
    gap: 14,
    borderWidth: 1
  },
  switchLabel: {
    fontSize: 20,
    fontWeight: "800"
  },
  input: {
    borderRadius: radii.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1
  },
  passwordRow: {
    borderRadius: radii.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  passwordInput: {
    flex: 1
  },
  toggleText: {
    fontWeight: "700"
  },
  primaryButton: {
    borderRadius: radii.pill,
    paddingVertical: 14,
    alignItems: "center"
  },
  primaryText: {
    fontWeight: "800",
    fontSize: 16
  },
  secondaryText: {
    textAlign: "center",
    fontWeight: "700"
  },
  quickRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 12
  },
  quickButton: {
    flex: 1,
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: "center"
  },
  quickButtonText: {
    fontWeight: "700"
  }
});
