import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  ListRenderItemInfo,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import * as Location from "expo-location";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CategoryPill } from "@/components/CategoryPill";
import { ErrorState } from "@/components/ErrorState";
import { Loader } from "@/components/Loader";
import { NewsCard } from "@/components/NewsCard";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { radii } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { RootStackParamList } from "@/navigation/types";
import { userService } from "@/services/userService";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { useBookmarkStore } from "@/store/bookmarkStore";
import { useNewsStore } from "@/store/newsStore";
import { NewsArticle } from "@/types/news";

const SIGNUP_TIMER_MS = 10000;

export function HomeScreen() {
  const { colors } = useTheme();
  const mode = useThemeStore((state) => state.mode);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isGuest = useAuthStore((state) => state.isGuest);
  const user = useAuthStore((state) => state.user);
  const setLocation = useAuthStore((state) => state.setLocation);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  const isBookmarked = useBookmarkStore((state) => state.isBookmarked);
  const {
    articles,
    categories,
    selectedCategory,
    isLoading,
    isRefreshing,
    error,
    freezeFeed,
    fetchBootstrap,
    fetchNews,
    selectCategory
  } = useNewsStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const repromptRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [localFreeze, setLocalFreeze] = useState(false);
  const hasFullAccess = isAuthenticated;
  const feedFrozenForGuest = !hasFullAccess && (localFreeze || (showSignupPrompt && isFocused));

  useEffect(() => {
    if (hasFullAccess) {
      setLocalFreeze(false);
      setShowSignupPrompt(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (!isFocused) {
      return;
    }

    setLocalFreeze(false);
    setShowSignupPrompt(false);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setLocalFreeze(true);
      setShowSignupPrompt(true);
    }, SIGNUP_TIMER_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (repromptRef.current) {
        clearTimeout(repromptRef.current);
        repromptRef.current = null;
      }
    };
  }, [hasFullAccess, isFocused, navigation]);

  useEffect(() => {
    if (hasFullAccess || !localFreeze || !isFocused) {
      return;
    }

    if (showSignupPrompt) {
      return;
    }

    // Keep the prompt visible while feed is frozen.
    repromptRef.current = setTimeout(() => {
      setShowSignupPrompt(true);
    }, 900);

    return () => {
      if (repromptRef.current) {
        clearTimeout(repromptRef.current);
        repromptRef.current = null;
      }
    };
  }, [hasFullAccess, isFocused, localFreeze, showSignupPrompt]);

  useEffect(() => {
    if (user?.location) {
      return;
    }

    let mounted = true;

    async function enableLocation() {
      try {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (permission.status !== "granted") {
          return;
        }

        const current = await Location.getCurrentPositionAsync({});
        const [place] = await Location.reverseGeocodeAsync(current.coords);
        const nextLocation = [place?.city, place?.region].filter(Boolean).join(", ")
          || `${current.coords.latitude.toFixed(3)}, ${current.coords.longitude.toFixed(3)}`;

        if (!mounted) {
          return;
        }

        setLocation(nextLocation);
        updateProfile({ state: place?.region ?? null, city: place?.city ?? null });
        await userService.saveLocation({
          userId: user?.id,
          name: user?.name,
          email: user?.email ?? undefined,
          phoneNumber: user?.phoneNumber ?? undefined,
          state: place?.region || "Unknown",
          city: place?.city || undefined,
          location: nextLocation,
          isGuest
        });
      } catch {
        Alert.alert("Location unavailable", "We could not enable local news automatically. You can still use the app normally.");
      }
    }

    enableLocation();

    return () => {
      mounted = false;
    };
  }, [isGuest, setLocation, user]);

  useEffect(() => {
    if (!articles.length) {
      fetchBootstrap();
    }
  }, [articles.length, fetchBootstrap]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchNews({
        category: selectedCategory === "all" ? "all" : selectedCategory,
        refresh: true
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchNews, selectedCategory]);

  useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },
    []
  );

  const handleRefresh = useCallback(() => {
    fetchNews({ refresh: true });
  }, [fetchNews]);

  const handleSelectCategory = useCallback(
    (category: string) => {
      selectCategory(category);
      fetchNews({ category: category === "all" ? "all" : category });
    },
    [fetchNews, selectCategory]
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<NewsArticle>) => (
      <NewsCard
        article={item}
        onPress={() => {
          if (!hasFullAccess) {
            setShowLoginPrompt(true);
            return;
          }
          navigation.navigate("NewsDetail", { article: item });
        }}
        isFavorite={isBookmarked(item.id)}
        favoriteDisabled={!hasFullAccess}
        onFavoritePress={() => {
          if (!hasFullAccess) {
            Alert.alert("Login to save favorites");
            return;
          }
          toggleBookmark(item);
        }}
      />
    ),
    [hasFullAccess, isBookmarked, navigation, toggleBookmark]
  );

  const isAdmin = user?.role === "admin";
  const rightLabel = useMemo(() => (isAuthenticated ? (isAdmin ? "Admin" : "Profile") : "Login"), [isAdmin, isAuthenticated]);

  if (isLoading && !articles.length) {
    return (
      <Screen>
        <Loader />
      </Screen>
    );
  }

  if (error && !articles.length) {
    return (
      <Screen>
        <ErrorState message={error} onRetry={fetchBootstrap} />
      </Screen>
    );
  }

  return (
    <Screen>
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top, 12) }]}
        initialNumToRender={5}
        windowSize={7}
        maxToRenderPerBatch={6}
        removeClippedSubviews
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        scrollEnabled={!feedFrozenForGuest}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <TopBar
              subtitle={user?.location ?? "Live news tailored to your location"}
              rightLabel={rightLabel}
              onRightPress={() =>
                isAuthenticated
                  ? (isAdmin ? navigation.navigate("AdminUploadNews") : navigation.navigate("MainTabs", { screen: "Post" }))
                  : navigation.navigate("Auth")
              }
              onFavoritesPress={() => navigation.navigate("Favorites")}
              onNotificationsPress={() => navigation.navigate("Notifications")}
              onPrivacyPress={() => navigation.navigate("Privacy")}
            />
            <View style={styles.header}>
              <View>
                <Text style={[styles.heading, { color: colors.text }]}>Latest News</Text>
                <Text style={[styles.subheading, { color: colors.textMuted }]}>
                  Top stories, live updates, and local context in one feed
                </Text>
              </View>
              {isGuest ? <Text style={[styles.guestChip, { color: colors.secondary }]}>Guest mode</Text> : null}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
              {categories.map((category) => (
                <CategoryPill
                  key={category.id}
                  label={category.name}
                  selected={selectedCategory === category.slug}
                  onPress={() => handleSelectCategory(category.slug)}
                />
              ))}
            </ScrollView>

            {error ? (
              <Text style={[styles.errorBanner, { backgroundColor: colors.card, color: colors.danger, borderColor: colors.border }]}>
                {error}
              </Text>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No news found</Text>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              Try another category or refresh for fresh data.
            </Text>
          </View>
        }
      />

      <Modal visible={showSignupPrompt && isFocused} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalCard,
              {
                // Invert popup color per requirement:
                // - dark theme -> white popup
                // - light theme -> black popup
                backgroundColor: mode === "dark" ? "#FFFFFF" : "#0B1220",
                borderColor: colors.border
              }
            ]}
          >
            <Text style={[styles.modalTitle, { color: mode === "dark" ? "#0B1220" : "#FFFFFF" }]}>Sign up to continue</Text>
            <Text style={[styles.modalText, { color: mode === "dark" ? "rgba(15, 23, 42, 0.74)" : "rgba(255, 255, 255, 0.78)" }]}>
              Please sign up or login to continue reading full news stories.
            </Text>
            <Pressable
              onPress={() => {
                setShowSignupPrompt(false);
                navigation.navigate("Auth", { mode: "signup" });
              }}
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.modalButtonText, { color: colors.backgroundAlt }]}>Sign up</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setShowSignupPrompt(false);
                navigation.navigate("Auth", { mode: "login" });
              }}
              style={[styles.modalButton, { backgroundColor: mode === "dark" ? "#F1F5F9" : "rgba(255,255,255,0.12)", borderColor: mode === "dark" ? "#E2E8F0" : "rgba(255,255,255,0.22)", borderWidth: 1 }]}
            >
              <Text style={[styles.modalButtonText, { color: mode === "dark" ? "#0B1220" : "#FFFFFF" }]}>Login</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={showLoginPrompt} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Login Required</Text>
            <Text style={[styles.modalText, { color: colors.textMuted }]}>Login to read full article.</Text>
            <Pressable
              onPress={() => {
                setShowLoginPrompt(false);
                navigation.navigate("Auth");
              }}
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.modalButtonText, { color: colors.backgroundAlt }]}>Login</Text>
            </Pressable>
            <Pressable onPress={() => setShowLoginPrompt(false)}>
              <Text style={[styles.dismissText, { color: colors.textMuted }]}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 108
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18
  },
  heading: {
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -0.4
  },
  subheading: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: "600"
  },
  guestChip: {
    fontWeight: "700"
  },
  categoryRow: {
    paddingBottom: 18
  },
  errorBanner: {
    padding: 14,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1
  },
  empty: {
    marginTop: 32,
    alignItems: "center"
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800"
  },
  emptyText: {
    marginTop: 8
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.32)",
    justifyContent: "center",
    paddingHorizontal: 20
  },
  modalCard: {
    borderRadius: radii.lg,
    padding: 20,
    borderWidth: 1
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "900"
  },
  modalText: {
    marginTop: 10,
    lineHeight: 22
  },
  modalButton: {
    marginTop: 18,
    borderRadius: radii.pill,
    paddingVertical: 14,
    alignItems: "center"
  },
  modalButtonText: {
    fontWeight: "800"
  },
  dismissText: {
    textAlign: "center",
    marginTop: 14,
    fontWeight: "700"
  }
});
