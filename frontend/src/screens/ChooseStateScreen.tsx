import { useMemo, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { radii } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { RootStackParamList } from "@/navigation/types";
import { userService } from "@/services/userService";
import { useAuthStore } from "@/store/authStore";

const INDIA_STATES_AND_UTS = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
] as const;

export function ChooseStateScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useAuthStore((s) => s.user);
  const isGuest = useAuthStore((s) => s.isGuest);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const logout = useAuthStore((s) => s.logout);
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [...INDIA_STATES_AND_UTS];
    return INDIA_STATES_AND_UTS.filter((state) => state.toLowerCase().includes(q));
  }, [query]);

  const currentState = user?.state ?? null;

  const saveState = async (state: string) => {
    setSaving(true);
    try {
      updateProfile({ state });

      if (user?.id) {
        await userService.updateProfile(user.id, { state });
      } else {
        await userService.saveLocation({
          state,
          isGuest,
          location: user?.location ?? undefined,
          name: user?.name ?? undefined,
          email: user?.email ?? undefined,
          phoneNumber: user?.phoneNumber ?? undefined
        });
      }

      navigation.goBack();
    } catch (error) {
      const status = (error as any)?.response?.status as number | undefined;
      if (status === 404) {
        Alert.alert("Session expired", "Please login again (the account was reset).");
        logout();
        navigation.reset({ index: 0, routes: [{ name: "Auth", params: { mode: "login" } }] });
        return;
      }
      Alert.alert("Update failed", error instanceof Error ? error.message : "Unable to save your state.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <FlatList
        data={items}
        keyExtractor={(item) => item}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View>
            <TopBar title="Choose State" subtitle="Used for local news and regional videos" />
            <View style={[styles.searchWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="search" size={18} color={colors.textMuted} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search state or UT"
                placeholderTextColor={colors.textMuted}
                style={[styles.searchInput, { color: colors.text }]}
              />
              {query.length ? (
                <Pressable onPress={() => setQuery("")} hitSlop={10}>
                  <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                </Pressable>
              ) : null}
            </View>
            {saving ? <Text style={[styles.saving, { color: colors.textMuted }]}>Saving...</Text> : null}
          </View>
        }
        renderItem={({ item }) => {
          const selected = currentState?.toLowerCase() === item.toLowerCase();
          return (
            <Pressable
              onPress={() => saveState(item)}
              disabled={saving}
              style={({ pressed }) => [
                styles.row,
                {
                  backgroundColor: pressed ? colors.surface : colors.card,
                  borderColor: selected ? colors.primary : colors.border,
                  opacity: saving ? 0.7 : 1
                }
              ]}
            >
              <Text style={[styles.stateText, { color: colors.text }]}>{item}</Text>
              {selected ? <Ionicons name="checkmark-circle" size={20} color={colors.primary} /> : <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />}
            </Pressable>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24
  },
  searchWrap: {
    marginTop: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  searchInput: {
    flex: 1,
    fontWeight: "700"
  },
  saving: {
    marginBottom: 10,
    fontWeight: "700"
  },
  row: {
    borderWidth: 1,
    borderRadius: radii.lg,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10
  },
  stateText: {
    fontSize: 15,
    fontWeight: "800"
  }
});

