import { Pressable, StyleSheet, Text, View } from "react-native";
import { radii } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Something went wrong</Text>
      <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text>
      <Pressable onPress={onRetry} style={[styles.button, { backgroundColor: colors.primary }]}>
        <Text style={[styles.buttonText, { color: colors.backgroundAlt }]}>Try again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
  },
  message: {
    textAlign: "center",
    lineHeight: 22,
  },
  button: {
    borderRadius: radii.pill,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  buttonText: {
    fontWeight: "700",
  },
});
