import { ComponentProps, memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@/hooks/useTheme";
import { AuthScreen } from "@/screens/AuthScreen";
import { HomeScreen } from "@/screens/HomeScreen";
import { LiveScreen } from "@/screens/LiveScreen";
import { NewsDetailScreen } from "@/screens/NewsDetailScreen";
import { NotificationsScreen } from "@/screens/NotificationsScreen";
import { PostScreen } from "@/screens/PostScreen";
import { PrivacyScreen } from "@/screens/PrivacyScreen";
import { SplashScreen } from "@/screens/SplashScreen";
import { AdminUsersScreen } from "@/screens/AdminUsersScreen";
import { BookmarkScreen } from "@/screens/BookmarkScreen";
import { VideosScreen } from "@/screens/VideosScreen";
import { AdminUploadNewsScreen } from "@/screens/AdminUploadNewsScreen";
import { AdminUploadVlogScreen } from "@/screens/AdminUploadVlogScreen";
import { AdminUploadLiveScreen } from "@/screens/AdminUploadLiveScreen";
import { ChooseStateScreen } from "@/screens/ChooseStateScreen";
import { MainTabParamList, RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

type IoniconName = ComponentProps<typeof Ionicons>["name"];

const tabIconNames: Record<string, IoniconName> = {
  Home: "home",
  Live: "tv",
  Videos: "play-circle",
  Post: "add-circle"
};

const tabLabels: Record<string, string> = {
  Home: "Home",
  Live: "Live TV",
  Videos: "Video",
  Post: "Citizen Journalist"
};

const TabIcon = memo(({ label, focused }: { label: string; focused: boolean }) => {
  const { colors } = useTheme();
  const iconName = tabIconNames[label] ?? "ellipse";
  const title = tabLabels[label] ?? label;

  return (
    <View style={styles.tabItem}>
      <View
        style={[
          styles.tabIconWrap,
          {
            backgroundColor: focused ? "rgba(229, 82, 40, 0.12)" : "transparent"
          }
        ]}
      >
        <Ionicons name={iconName} size={18} color={focused ? colors.primary : colors.textMuted} />
      </View>
      <Text style={[styles.tabLabel, { color: focused ? colors.primary : colors.textMuted, fontWeight: focused ? "900" : "700" }]}>
        {title}
      </Text>
    </View>
  );
});

function MainTabs() {
  const { colors } = useTheme();

  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          left: 14,
          right: 14,
          bottom: 18,
          height: 76,
          paddingTop: 8,
          paddingBottom: 9,
          paddingHorizontal: 8,
          borderRadius: 34,
          borderWidth: 1,
          borderTopWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.backgroundAlt,
          shadowColor: "#111827",
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.12,
          shadowRadius: 22,
          elevation: 18
        },
        tabBarItemStyle: {
          borderRadius: 26,
          marginHorizontal: 1
        }
      }}
    >
      <Tabs.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Home" focused={focused} /> }}
      />
      <Tabs.Screen
        name="Live"
        component={LiveScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Live" focused={focused} /> }}
      />
      <Tabs.Screen
        name="Videos"
        component={VideosScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Videos" focused={focused} /> }}
      />
      <Tabs.Screen
        name="Post"
        component={PostScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Post" focused={focused} /> }}
      />
    </Tabs.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Auth" component={AuthScreen} options={{ presentation: "modal" }} />
      <Stack.Screen
        name="NewsDetail"
        component={NewsDetailScreen}
        options={{ headerShown: true, title: "Article", animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="AdminUsers"
        component={AdminUsersScreen}
        options={{ headerShown: true, title: "Users", animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="AdminUploadNews"
        component={AdminUploadNewsScreen}
        options={{ headerShown: true, title: "Upload News", animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="AdminUploadVlog"
        component={AdminUploadVlogScreen}
        options={{ headerShown: true, title: "Upload Vlog", animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="AdminUploadLive"
        component={AdminUploadLiveScreen}
        options={{ headerShown: true, title: "Upload Live", animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="ChooseState"
        component={ChooseStateScreen}
        options={{ headerShown: true, title: "Choose State", animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="Favorites"
        component={BookmarkScreen}
        options={{ headerShown: true, title: "Favorites", animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ headerShown: true, title: "Notifications", animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="Privacy"
        component={PrivacyScreen}
        options={{ headerShown: true, title: "Privacy", animation: "slide_from_right" }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    minWidth: 70
  },
  tabIconWrap: {
    minWidth: 34,
    height: 28,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8
  },
  tabLabel: {
    fontSize: 10,
    textAlign: "center"
  }
});
