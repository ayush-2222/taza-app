import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { radii } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

const sections = [
  {
    title: "Privacy Policy",
    text: "Taaza TV stores profile details, location preferences, favorites, and posting activity only to power your news experience."
  },
  {
    title: "Terms and Conditions",
    text: "Users are responsible for submitted citizen-journalist content. Admins can moderate, create, update, and remove news/video content."
  },
  {
    title: "Location",
    text: "Location is requested by default so the feed can prioritize local news. You can deny permission and continue using the app."
  }
];

export function PrivacyScreen() {
  const { colors } = useTheme();

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <TopBar title="Privacy" subtitle="Policy, terms, and location controls" />
        {sections.map((section) => (
          <View key={section.title} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>{section.title}</Text>
            <Text style={[styles.text, { color: colors.textMuted }]}>{section.text}</Text>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 28
  },
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: 18,
    marginBottom: 14
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8
  },
  text: {
    lineHeight: 22
  }
});
