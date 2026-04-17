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

export function AdminUploadLiveScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useAuthStore((state) => state.user);
  const [title, setTitle] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [region, setRegion] = useState(user?.state ?? "");
  const [criteria, setCriteria] = useState("Live");
  const [videoFile, setVideoFile] = useState<{ uri: string; name?: string; type?: string } | undefined>();

  useEffect(() => {
    if (user?.role !== "admin") {
      Alert.alert("Admin only", "This section is available only for admin.");
      navigation.reset({ index: 0, routes: [{ name: "MainTabs" }] });
    }
  }, [navigation, user?.role]);

  const pickLiveVideoFromDevice = async () => {
    try {
      // IMPORTANT: lazy-load to avoid crashing when native module isn't built yet.
      const DocumentPicker = require("expo-document-picker") as typeof import("expo-document-picker");
      const result = await DocumentPicker.getDocumentAsync({ type: "video/*" });
      if (result.canceled) {
        return;
      }
      const asset = result.assets?.[0];
      if (!asset?.uri) {
        Alert.alert("Picker issue", "Could not read selected video.");
        return;
      }
      setVideoFile({
        uri: asset.uri,
        name: asset.name ?? "live-video.mp4",
        type: asset.mimeType ?? "video/mp4"
      });
    } catch {
      Alert.alert(
        "Rebuild required",
        "Your current Android app build doesn't include the document picker yet. Rebuild the app, then try again."
      );
    }
  };

  const handleUpload = async () => {
    if (!title.trim()) {
      Alert.alert("Missing title", "Please enter a live video title.");
      return;
    }
    if (!liveUrl.trim() && !videoFile?.uri) {
      Alert.alert("Missing video", "Please provide a live URL or select a video from your device.");
      return;
    }
    try {
      await videoService.createVideo({
        title: [region ? `(${region})` : null, criteria ? `[${criteria}]` : null, title].filter(Boolean).join(" "),
        videoUrl: liveUrl.trim() || undefined,
        thumbnail: thumbnail || undefined,
        videoFile,
        isLive: true
      });
      setTitle("");
      setLiveUrl("");
      setThumbnail("");
      setCriteria("Live");
      setVideoFile(undefined);
      Alert.alert("Uploaded", "Live video uploaded successfully.");
    } catch (error) {
      Alert.alert("Upload failed", error instanceof Error ? error.message : "Please check live video fields.");
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TopBar title="Admin Live Upload" subtitle="Upload live stream videos" />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TextInput value={title} onChangeText={setTitle} placeholder="Live title" placeholderTextColor={colors.textMuted} style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.backgroundAlt }]} />
          <TextInput value={region} onChangeText={setRegion} placeholder="Region / State" placeholderTextColor={colors.textMuted} style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.backgroundAlt }]} />
          <TextInput value={criteria} onChangeText={setCriteria} placeholder="Criteria tag" placeholderTextColor={colors.textMuted} style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.backgroundAlt }]} />
          <TextInput value={liveUrl} onChangeText={setLiveUrl} placeholder="Optional live URL (m3u8/mp4)" placeholderTextColor={colors.textMuted} style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.backgroundAlt }]} />
          <TextInput value={thumbnail} onChangeText={setThumbnail} placeholder="Optional thumbnail URL" placeholderTextColor={colors.textMuted} style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.backgroundAlt }]} />
          <Pressable onPress={pickLiveVideoFromDevice} style={[styles.button, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.buttonText, { color: colors.text }]}>
              {videoFile ? `Selected: ${videoFile.name ?? "video"}` : "Pick video from device"}
            </Text>
          </Pressable>
          <Pressable onPress={handleUpload} style={[styles.button, { backgroundColor: colors.primary }]}>
            <Text style={[styles.buttonText, { color: colors.backgroundAlt }]}>Upload Live Video</Text>
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

