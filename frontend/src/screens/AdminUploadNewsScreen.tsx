import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { radii } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { RootStackParamList } from "@/navigation/types";
import { newsService } from "@/services/newsService";
import { useAuthStore } from "@/store/authStore";

export function AdminUploadNewsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useAuthStore((state) => state.user);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [stateValue, setStateValue] = useState(user?.state ?? "");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (user?.role !== "admin") {
      Alert.alert("Admin only", "This section is available only for admin.");
      navigation.reset({ index: 0, routes: [{ name: "MainTabs" }] });
    }
  }, [navigation, user?.role]);

  const handleUpload = async () => {
    try {
      await newsService.createNews({
        title,
        description,
        content,
        category,
        state: stateValue || user?.state || "General",
        imageUrl: imageUrl || undefined
      });
      setTitle("");
      setDescription("");
      setContent("");
      setImageUrl("");
      Alert.alert("Uploaded", "News uploaded successfully.");
    } catch (error) {
      Alert.alert("Upload failed", error instanceof Error ? error.message : "Please check news fields.");
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TopBar title="Admin News Upload" subtitle="Create news post as admin" />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TextInput value={title} onChangeText={setTitle} placeholder="Title" placeholderTextColor={colors.textMuted} style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.backgroundAlt }]} />
          <TextInput value={description} onChangeText={setDescription} placeholder="Description" placeholderTextColor={colors.textMuted} style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.backgroundAlt }]} />
          <TextInput value={content} onChangeText={setContent} placeholder="Full content" placeholderTextColor={colors.textMuted} multiline style={[styles.input, styles.textArea, { color: colors.text, borderColor: colors.border, backgroundColor: colors.backgroundAlt }]} />
          <TextInput value={category} onChangeText={setCategory} placeholder="Category" placeholderTextColor={colors.textMuted} style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.backgroundAlt }]} />
          <TextInput value={stateValue} onChangeText={setStateValue} placeholder="State / Region" placeholderTextColor={colors.textMuted} style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.backgroundAlt }]} />
          <TextInput value={imageUrl} onChangeText={setImageUrl} placeholder="Optional image URL" placeholderTextColor={colors.textMuted} style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.backgroundAlt }]} />
          <Pressable onPress={handleUpload} style={[styles.button, { backgroundColor: colors.primary }]}>
            <Text style={[styles.buttonText, { color: colors.backgroundAlt }]}>Upload News</Text>
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 24 },
  card: { borderWidth: 1, borderRadius: radii.lg, padding: 16 },
  input: { borderWidth: 1, borderRadius: radii.md, paddingHorizontal: 12, paddingVertical: 12, marginBottom: 10 },
  textArea: { minHeight: 120, textAlignVertical: "top" },
  button: { borderRadius: radii.pill, borderWidth: 1, paddingVertical: 12, alignItems: "center", marginTop: 8 },
  buttonText: { fontWeight: "800" }
});

