import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { radii } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { RootStackParamList } from "@/navigation/types";
import { videoService } from "@/services/videoService";
import { useAuthStore } from "@/store/authStore";

export function AdminUploadVlogScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useAuthStore((state) => state.user);
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [region, setRegion] = useState(user?.state ?? "");
  const [criteria, setCriteria] = useState("");

  useEffect(() => {
    if (user?.role !== "admin") {
      Alert.alert("Admin only", "This section is available only for admin.");
      navigation.reset({ index: 0, routes: [{ name: "MainTabs" }] });
    }
  }, [navigation, user?.role]);

  const handleUpload = async () => {
    if (!title.trim()) {
      Alert.alert("Missing title", "Please enter a vlog title.");
      return;
    }
    if (!videoUrl.trim()) {
      Alert.alert("Missing video URL", "Please provide a public video URL for the vlog upload.");
      return;
    }
    try {
      await videoService.createVideo({
        title: [region ? `(${region})` : null, criteria ? `[${criteria}]` : null, title].filter(Boolean).join(" "),
        videoUrl: videoUrl.trim(),
        thumbnail: thumbnail || undefined,
        isLive: false
      });
      setTitle("");
      setVideoUrl("");
      setThumbnail("");
      setCriteria("");
      Alert.alert("Uploaded", "Vlog uploaded successfully.");
    } catch (error) {
      Alert.alert("Upload failed", error instanceof Error ? error.message : "Please check vlog fields.");
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TopBar title="Admin Vlog Upload" subtitle="Upload non-live videos" />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TextInput value={title} onChangeText={setTitle} placeholder="Vlog title" placeholderTextColor={colors.textMuted} style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.backgroundAlt }]} />
          <TextInput value={region} onChangeText={setRegion} placeholder="Region / State" placeholderTextColor={colors.textMuted} style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.backgroundAlt }]} />
          <TextInput value={criteria} onChangeText={setCriteria} placeholder="Criteria tag" placeholderTextColor={colors.textMuted} style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.backgroundAlt }]} />
          <TextInput value={videoUrl} onChangeText={setVideoUrl} placeholder="Optional video URL" placeholderTextColor={colors.textMuted} style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.backgroundAlt }]} />
          <TextInput value={thumbnail} onChangeText={setThumbnail} placeholder="Optional thumbnail URL" placeholderTextColor={colors.textMuted} style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.backgroundAlt }]} />
          <Pressable onPress={handleUpload} style={[styles.button, { backgroundColor: colors.primary }]}>
            <Text style={[styles.buttonText, { color: colors.backgroundAlt }]}>Upload Vlog</Text>
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
  button: { borderRadius: radii.pill, borderWidth: 1, paddingVertical: 12, alignItems: "center", marginTop: 8 },
  buttonText: { fontWeight: "800" }
});

