import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";

export function Loader({ label = "Loading latest stories..." }: { label?: string }) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  label: {
    fontSize: 14,
  },
});
