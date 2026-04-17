import { memo } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { radii } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export const CategoryPill = memo(({ label, selected, onPress }: Props) => {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.pill,
        {
          backgroundColor: selected ? colors.primary : colors.card,
          borderColor: selected ? colors.primary : colors.border
        }
      ]}
    >
      <Text style={[styles.text, { color: selected ? colors.backgroundAlt : colors.textMuted }]}>
        {label}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radii.pill,
    marginRight: 10,
    borderWidth: 1,
  },
  text: {
    fontSize: 13,
    fontWeight: "700",
  }
});
