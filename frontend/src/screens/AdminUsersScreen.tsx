import { useEffect, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { radii } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { AdminUser, userService } from "@/services/userService";
import { useAuthStore } from "@/store/authStore";
import { RootStackParamList } from "@/navigation/types";

export function AdminUsersScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useAuthStore((state) => state.user);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.role !== "admin") {
      Alert.alert("Admin only", "You do not have permission to view this screen.");
      navigation.reset({ index: 0, routes: [{ name: "MainTabs" }] });
    }
  }, [navigation, user?.role]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const nextUsers = await userService.getRegisteredUsers();
      setUsers(nextUsers);
    } catch {
      Alert.alert("Access denied", "Unable to load users. Please sign in as admin.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <Screen>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <TopBar title="Users" subtitle="All registered users" />
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>Registered Users</Text>
              <Pressable onPress={loadUsers} style={[styles.refreshButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.refreshText, { color: colors.text }]}>{isLoading ? "Loading" : "Refresh"}</Text>
              </Pressable>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.row}>
              <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.role, { color: item.role === "admin" ? colors.primary : colors.secondary }]}>{item.role}</Text>
            </View>
            <Text style={[styles.meta, { color: colors.textMuted }]}>{item.email ?? "No email"}</Text>
            <Text style={[styles.meta, { color: colors.textMuted }]}>{item.phoneNumber ?? "No phone"}</Text>
            <Text style={[styles.meta, { color: colors.textMuted }]}>{item.location ?? "No location yet"}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textMuted }]}>
            {isLoading ? "Loading users..." : "No registered users found."}
          </Text>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14
  },
  title: {
    fontSize: 24,
    fontWeight: "900"
  },
  refreshButton: {
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 9
  },
  refreshText: {
    fontWeight: "800"
  },
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  name: {
    fontSize: 18,
    fontWeight: "900",
    flex: 1
  },
  role: {
    fontWeight: "900",
    textTransform: "uppercase"
  },
  meta: {
    marginTop: 6
  },
  empty: {
    marginTop: 32,
    textAlign: "center"
  }
});
