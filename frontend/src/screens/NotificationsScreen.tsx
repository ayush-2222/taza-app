import { StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { radii } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

export function NotificationsScreen() {
  const { colors } = useTheme();

  return (
    <Screen>
      <TopBar title="Notifications" subtitle="News alerts and account updates" />
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Notifications</Text>
        <Text style={[styles.text, { color: colors.textMuted }]}>
          Live updates, admin uploads, and breaking-news alerts will appear here. Real-time backend events are already emitted for likes and citizen news.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: 18
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 8
  },
  text: {
    lineHeight: 22
  }
});
