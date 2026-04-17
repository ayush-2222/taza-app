import { useState } from "react";
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { radii } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { RootStackParamList } from "@/navigation/types";
import { useThemeStore } from "@/store/themeStore";
import { useAuthStore } from "@/store/authStore";

type Props = {
  title?: string;
  subtitle?: string;
  rightLabel?: string;
  onRightPress?: () => void;
  onFavoritesPress?: () => void;
  onNotificationsPress?: () => void;
  onPrivacyPress?: () => void;
};

type DrawerItem = {
  icon: string;
  iconName?: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  danger?: boolean;
  onPress: () => void;
};

export function TopBar({
  title = "Taaza TV",
  subtitle,
  rightLabel,
  onRightPress,
  onFavoritesPress,
  onNotificationsPress,
  onPrivacyPress
}: Props) {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const mode = useThemeStore((state) => state.mode);
  const toggleMode = useThemeStore((state) => state.toggleMode);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isAdmin = user?.role === "admin";
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = () => setDrawerOpen(false);

  const openRoute = (route: keyof RootStackParamList) => {
    closeDrawer();
    navigation.navigate(route as never);
  };

  const openAuth = (mode: "login" | "signup" = "signup") => {
    closeDrawer();
    navigation.navigate("Auth", { mode });
  };

  const openProfile = () => {
    closeDrawer();
    if (!isAuthenticated) {
      navigation.navigate("Auth", { mode: "login" });
      return;
    }
    if (isAdmin) {
      navigation.navigate("AdminUploadNews");
      return;
    }
    navigation.navigate("MainTabs", { screen: "Post" });
  };

  const profileItems: DrawerItem[] = [
    ...(isAdmin ? [] : [{ icon: "PR", iconName: "person" as const, label: isAuthenticated ? "Profile / Settings" : "Sign up / Login", onPress: openProfile }]),
    { icon: "ST", iconName: "location", label: "Choose State", onPress: () => openRoute("ChooseState") },
    { icon: mode === "dark" ? "LT" : "DK", iconName: mode === "dark" ? "sunny" : "moon", label: mode === "dark" ? "Switch to Light" : "Switch to Dark", onPress: toggleMode },
    ...(isAdmin ? [] : [{ icon: "CJ", iconName: "create" as const, label: "Citizen Journalist", onPress: () => openRoute("MainTabs") }])
  ];

  const savedItems: DrawerItem[] = [
    { icon: "SV", iconName: "bookmark", label: "Saved News", onPress: () => openRoute("Favorites") },
    { icon: "LK", iconName: "heart", label: "Liked News", onPress: () => openRoute("Favorites") }
  ];

  const legalItems: DrawerItem[] = [
    { icon: "PP", iconName: "shield-checkmark", label: "Privacy Policy", onPress: () => openRoute("Privacy") },
    { icon: "TC", iconName: "document-text", label: "Terms and Conditions", onPress: () => openRoute("Privacy") },
    { icon: "AB", iconName: "information-circle", label: "About Us", onPress: () => openRoute("Privacy") },
    { icon: "CT", iconName: "mail", label: "Contact Us", onPress: () => openRoute("Privacy") }
  ];

  const adminItems: DrawerItem[] = [
    { icon: "AN", iconName: "newspaper", label: "Upload News Post", onPress: () => openRoute("AdminUploadNews") },
    { icon: "AV", iconName: "videocam", label: "Upload Vlog Video", onPress: () => openRoute("AdminUploadVlog") },
    { icon: "AL", iconName: "radio", label: "Upload Live Video", onPress: () => openRoute("AdminUploadLive") },
    { icon: "AU", iconName: "people", label: "View All Users", onPress: () => openRoute("AdminUsers") }
  ];

  const renderGroup = (heading: string, items: DrawerItem[]) => (
    <View style={styles.drawerGroup}>
      <Text style={[styles.drawerHeading, { color: colors.textMuted }]}>{heading}</Text>
      {items.map((item) => (
        <Pressable
          key={item.label}
          android_ripple={{ color: colors.surface }}
          onPress={item.onPress}
          style={({ pressed }) => [
            styles.drawerItem,
            {
              backgroundColor: pressed ? colors.surface : "transparent",
              opacity: pressed ? 0.72 : 1
            }
          ]}
        >
          <View style={[styles.drawerIcon, { backgroundColor: item.danger ? "rgba(220, 38, 38, 0.12)" : colors.surface }]}>
            {item.iconName ? (
              <Ionicons name={item.iconName} size={16} color={item.danger ? colors.danger : colors.text} />
            ) : (
              <Text style={[styles.drawerIconText, { color: item.danger ? colors.danger : colors.text }]}>{item.icon}</Text>
            )}
          </View>
          <Text style={[styles.drawerLabel, { color: item.danger ? colors.danger : colors.text }]}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.logoCard, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }]}>
        <Pressable
          onPress={() => setDrawerOpen(true)}
          android_ripple={{ color: colors.surface, borderless: true }}
          style={styles.menuButton}
        >
          <Ionicons name="menu" size={18} color={colors.text} />
        </Pressable>
        <Image source={require("../logo.png")} style={styles.logoBadge} resizeMode="contain" />
        <View style={styles.logoTextWrap}>
          <Text style={[styles.logoText, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.locationText, { color: colors.textMuted }]}>
            {subtitle ?? user?.location ?? "Location will appear here"}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        {onFavoritesPress ? (
          <Pressable
            onPress={onFavoritesPress}
            style={({ pressed }) => [styles.iconButton, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.72 : 1 }]}
          >
            <Ionicons name="heart" size={18} color={colors.text} />
          </Pressable>
        ) : null}
        {onNotificationsPress ? (
          <Pressable
            onPress={onNotificationsPress}
            style={({ pressed }) => [styles.iconButton, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.72 : 1 }]}
          >
            <Ionicons name="notifications" size={18} color={colors.text} />
          </Pressable>
        ) : null}
        {onPrivacyPress ? (
          <Pressable
            onPress={onPrivacyPress}
            style={({ pressed }) => [styles.iconButton, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.72 : 1 }]}
          >
            <Ionicons name="shield-checkmark" size={18} color={colors.text} />
          </Pressable>
        ) : null}
        {rightLabel ? (
          <Pressable
            onPress={onRightPress}
            style={({ pressed }) => [styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.72 : 1 }]}
          >
            <Text style={[styles.actionText, { color: colors.text }]}>{rightLabel}</Text>
          </Pressable>
        ) : null}
      </View>

      <Modal visible={drawerOpen} transparent animationType="fade" onRequestClose={closeDrawer}>
        <View style={styles.drawerBackdrop}>
          <Pressable style={styles.drawerScrim} onPress={closeDrawer} />
          <View style={[styles.drawer, { backgroundColor: colors.backgroundAlt }]}>
            <LinearGradient colors={["#3F8CFF", "#4D7CFE"]} style={styles.drawerHero}>
              <Image source={require("../logo.png")} style={styles.drawerLogo} resizeMode="contain" />
              <Text style={styles.drawerWelcome}>Welcome {user?.name ?? "Guest User"}</Text>
              <Text style={styles.drawerSubtext}>{user?.location ?? "Choose your state for local news"}</Text>
            </LinearGradient>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.drawerContent}>
              {isAdmin ? (
                <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.profileAvatar, { backgroundColor: colors.primary }]}>
                    <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" />
                  </View>
                  <View style={styles.profileCopy}>
                    <Text style={[styles.profileName, { color: colors.text }]}>Admin Panel</Text>
                    <Text style={[styles.profileSubtext, { color: colors.textMuted }]}>Use separate sections for each admin action</Text>
                  </View>
                </View>
              ) : (
                <Pressable
                  onPress={openProfile}
                  style={({ pressed }) => [
                    styles.profileCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      opacity: pressed ? 0.76 : 1
                    }
                  ]}
                >
                  <View style={[styles.profileAvatar, { backgroundColor: colors.primary }]}>
                    <Text style={styles.profileAvatarText}>{(user?.name ?? "Guest").slice(0, 1).toUpperCase()}</Text>
                  </View>
                  <View style={styles.profileCopy}>
                    <Text style={[styles.profileName, { color: colors.text }]}>{user?.name ?? "Guest User"}</Text>
                    <Text style={[styles.profileSubtext, { color: colors.textMuted }]}>
                      {isAuthenticated ? "View profile and settings" : "Sign up to unlock favorites"}
                    </Text>
                  </View>
                </Pressable>
              )}
              <View style={styles.quickGrid}>
                {!isAdmin ? (
                  <Pressable onPress={openProfile} style={[styles.quickAction, { backgroundColor: colors.surface }]}>
                    <Ionicons name="person" size={18} color={colors.primary} />
                    <Text style={[styles.quickLabel, { color: colors.text }]}>Profile</Text>
                  </Pressable>
                ) : null}
                {isAdmin ? (
                  <>
                    <Pressable onPress={() => openRoute("AdminUploadNews")} style={[styles.quickAction, { backgroundColor: colors.surface }]}>
                      <Ionicons name="newspaper" size={18} color={colors.primary} />
                      <Text style={[styles.quickLabel, { color: colors.text }]}>News</Text>
                    </Pressable>
                    <Pressable onPress={() => openRoute("AdminUploadVlog")} style={[styles.quickAction, { backgroundColor: colors.surface }]}>
                      <Ionicons name="videocam" size={18} color={colors.primary} />
                      <Text style={[styles.quickLabel, { color: colors.text }]}>Vlog</Text>
                    </Pressable>
                    <Pressable onPress={() => openRoute("AdminUploadLive")} style={[styles.quickAction, { backgroundColor: colors.surface }]}>
                      <Ionicons name="radio" size={18} color={colors.primary} />
                      <Text style={[styles.quickLabel, { color: colors.text }]}>Live</Text>
                    </Pressable>
                    <Pressable onPress={() => openRoute("AdminUsers")} style={[styles.quickAction, { backgroundColor: colors.surface }]}>
                      <Ionicons name="people" size={18} color={colors.primary} />
                      <Text style={[styles.quickLabel, { color: colors.text }]}>Users</Text>
                    </Pressable>
                  </>
                ) : (
                  <>
                    <Pressable onPress={() => openRoute("Favorites")} style={[styles.quickAction, { backgroundColor: colors.surface }]}>
                      <Ionicons name="heart" size={18} color={colors.primary} />
                      <Text style={[styles.quickLabel, { color: colors.text }]}>Fav</Text>
                    </Pressable>
                    <Pressable onPress={() => openRoute("Notifications")} style={[styles.quickAction, { backgroundColor: colors.surface }]}>
                      <Ionicons name="notifications" size={18} color={colors.primary} />
                      <Text style={[styles.quickLabel, { color: colors.text }]}>Bell</Text>
                    </Pressable>
                    <Pressable onPress={() => openRoute("Privacy")} style={[styles.quickAction, { backgroundColor: colors.surface }]}>
                      <Ionicons name="shield-checkmark" size={18} color={colors.primary} />
                      <Text style={[styles.quickLabel, { color: colors.text }]}>Privacy</Text>
                    </Pressable>
                  </>
                )}
              </View>
              {renderGroup(isAdmin ? "Admin Profile / Settings" : "Profile / Settings", profileItems)}
              {isAdmin ? renderGroup("Admin Tools", adminItems) : renderGroup("Saved / Liked", savedItems)}
              {renderGroup("Legal", legalItems)}
              <Pressable
                android_ripple={{ color: "rgba(220, 38, 38, 0.1)" }}
                onPress={() => {
                  closeDrawer();
                  logout();
                  navigation.navigate("Auth");
                }}
                style={({ pressed }) => [styles.drawerItem, styles.logoutItem, { opacity: pressed ? 0.72 : 1 }]}
              >
                <View style={[styles.drawerIcon, { backgroundColor: "rgba(220, 38, 38, 0.12)" }]}>
                  <Ionicons name="log-out" size={16} color={colors.danger} />
                </View>
                <Text style={[styles.drawerLabel, { color: colors.danger }]}>Logout</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 14,
    marginBottom: 18,
    gap: 12
  },
  logoCard: {
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 4
  },
  menuButton: {
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 8
  },
  logoBadge: {
    width: 46,
    height: 46,
    borderRadius: radii.md,
    marginRight: 12
  },
  logoTextWrap: {
    flex: 1
  },
  logoText: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 0.2
  },
  locationText: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "600"
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 8
  },
  actionButton: {
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  iconButton: {
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  actionText: {
    fontWeight: "800"
  },
  iconText: {
    fontSize: 12,
    fontWeight: "900"
  },
  drawerBackdrop: {
    flex: 1,
    flexDirection: "row"
  },
  drawerScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(17, 24, 39, 0.4)"
  },
  drawer: {
    width: "82%",
    maxWidth: 340,
    minHeight: "100%",
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden"
  },
  drawerHero: {
    paddingTop: 52,
    paddingHorizontal: 22,
    paddingBottom: 24
  },
  drawerLogo: {
    width: 160,
    height: 72,
    marginBottom: 10
  },
  drawerWelcome: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900"
  },
  drawerSubtext: {
    color: "rgba(255, 255, 255, 0.82)",
    marginTop: 6,
    fontWeight: "700"
  },
  drawerContent: {
    padding: 18,
    paddingBottom: 36
  },
  profileCard: {
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center"
  },
  profileAvatarText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900"
  },
  profileCopy: {
    flex: 1
  },
  profileName: {
    fontSize: 17,
    fontWeight: "900"
  },
  profileSubtext: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700"
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18
  },
  quickAction: {
    width: "47%",
    borderRadius: radii.md,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    gap: 4
  },
  quickIcon: {
    fontSize: 11,
    fontWeight: "900"
  },
  quickLabel: {
    fontSize: 13,
    fontWeight: "800"
  },
  drawerGroup: {
    marginBottom: 18
  },
  drawerHeading: {
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    marginBottom: 8
  },
  drawerItem: {
    minHeight: 48,
    borderRadius: radii.md,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  drawerIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center"
  },
  drawerIconText: {
    fontSize: 10,
    fontWeight: "900"
  },
  drawerLabel: {
    fontSize: 15,
    fontWeight: "800"
  },
  logoutItem: {
    marginTop: 4
  }
});
