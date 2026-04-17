import { useMemo, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { radii } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { useAuthStore } from "@/store/authStore";
import { userService } from "@/services/userService";
import { newsService } from "@/services/newsService";
import { videoService } from "@/services/videoService";
import { citizenNewsService } from "@/services/citizenNewsService";
import { RootStackParamList } from "@/navigation/types";

export function PostScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const logout = useAuthStore((state) => state.logout);
  const [name, setName] = useState(user?.name ?? "");
  const [location, setLocation] = useState(user?.location ?? "");
  const [stateValue, setStateValue] = useState(user?.state ?? "");
  const [preferredCategory, setPreferredCategory] = useState(user?.preferredCategory ?? "General");
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirmNextPassword, setConfirmNextPassword] = useState("");
  const [citizenTitle, setCitizenTitle] = useState("");
  const [citizenContent, setCitizenContent] = useState("");
  const [citizenState, setCitizenState] = useState(user?.state ?? "");
  const [citizenLanguage, setCitizenLanguage] = useState("English");
  const [adminNewsId, setAdminNewsId] = useState("");
  const [adminTitle, setAdminTitle] = useState("");
  const [adminDescription, setAdminDescription] = useState("");
  const [adminContent, setAdminContent] = useState("");
  const [adminImageUrl, setAdminImageUrl] = useState("");
  const [adminCategory, setAdminCategory] = useState("General");
  const [adminState, setAdminState] = useState(user?.state ?? "");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoId, setVideoId] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoThumbnail, setVideoThumbnail] = useState("");
  const [videoState, setVideoState] = useState(user?.state ?? "");
  const [videoCriteria, setVideoCriteria] = useState("");
  const [liveTitle, setLiveTitle] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [liveThumbnail, setLiveThumbnail] = useState("");
  const [liveState, setLiveState] = useState(user?.state ?? "");
  const [liveCriteria, setLiveCriteria] = useState("");

  const isAdmin = useMemo(() => user?.role === "admin", [user?.role]);

  const handleProfileSave = async () => {
    try {
      if (user?.id) {
        await userService.updateProfile(user.id, { name, location, preferredCategory, state: stateValue });
      }
      updateProfile({ name, location, preferredCategory, state: stateValue });
      Alert.alert("Profile updated", "Your preferences were saved.");
    } catch (error) {
      const status = (error as any)?.response?.status as number | undefined;
      if (status === 404) {
        Alert.alert("Session expired", "Please login again (the account was reset).");
        logout();
        navigation.reset({ index: 0, routes: [{ name: "Auth", params: { mode: "login" } }] });
        return;
      }
      Alert.alert("Update issue", error instanceof Error ? error.message : "Please try again.");
    }
  };

  const handlePasswordChange = async () => {
    if (!user?.id) {
      handleProtectedPrompt();
      return;
    }
    if (!currentPassword || !nextPassword || !confirmNextPassword) {
      Alert.alert("Missing details", "Please enter current password and the new password twice.");
      return;
    }
    if (nextPassword !== confirmNextPassword) {
      Alert.alert("Password mismatch", "New password and confirm password must match.");
      return;
    }
    try {
      await userService.changePassword(user.id, { currentPassword, nextPassword });
      setCurrentPassword("");
      setNextPassword("");
      setConfirmNextPassword("");
      Alert.alert("Password updated", "Your password was changed successfully.");
    } catch (error) {
      Alert.alert("Password update failed", error instanceof Error ? error.message : "Please try again.");
    }
  };

  const handleProtectedPrompt = () => {
    Alert.alert("Login required", "Please sign in to post updates or use admin tools.");
  };

  const handleCitizenSubmit = async () => {
    try {
      await citizenNewsService.submit({
        title: citizenTitle,
        content: citizenContent,
        state: citizenState || user?.state || "General",
        language: citizenLanguage
      });
      setCitizenTitle("");
      setCitizenContent("");
      Alert.alert("Submitted", "Your citizen journalist story was submitted.");
    } catch (error) {
      Alert.alert("Submit failed", error instanceof Error ? error.message : "Please complete the citizen story fields.");
    }
  };

  const handleAdminNewsCreate = async () => {
    try {
      await newsService.createNews({
        title: adminTitle,
        description: adminDescription,
        content: adminContent,
        imageUrl: adminImageUrl || undefined,
        category: adminCategory,
        state: adminState || user?.state || "General"
      });
      setAdminTitle("");
      setAdminDescription("");
      setAdminContent("");
      setAdminImageUrl("");
      Alert.alert("News uploaded", "Users can refresh the feed to see this post.");
    } catch (error) {
      Alert.alert("Upload failed", error instanceof Error ? error.message : "Please check the news fields.");
    }
  };

  const handleAdminNewsUpdate = async () => {
    if (!adminNewsId) {
      Alert.alert("Missing ID", "Enter the news ID to update.");
      return;
    }

    try {
      await newsService.updateNews(adminNewsId, {
        title: adminTitle || undefined,
        description: adminDescription || undefined,
        content: adminContent || undefined,
        imageUrl: adminImageUrl || undefined,
        category: adminCategory || undefined,
        state: adminState || undefined
      });
      Alert.alert("News updated", "Users can refresh the feed to see the update.");
    } catch (error) {
      Alert.alert("Update failed", error instanceof Error ? error.message : "Please check the news ID and fields.");
    }
  };

  const handleAdminNewsDelete = async () => {
    if (!adminNewsId) {
      Alert.alert("Missing ID", "Enter the news ID to delete.");
      return;
    }

    try {
      await newsService.deleteNews(adminNewsId);
      setAdminNewsId("");
      Alert.alert("News deleted", "The post was removed.");
    } catch (error) {
      Alert.alert("Delete failed", error instanceof Error ? error.message : "Please check the news ID.");
    }
  };

  const handleAdminVideoCreate = async (isLive: boolean) => {
    const title = isLive ? liveTitle : videoTitle;
    const nextVideoUrl = isLive ? liveUrl : videoUrl;
    const thumbnail = isLive ? liveThumbnail : videoThumbnail;
    const state = isLive ? liveState : videoState;
    const criteria = isLive ? liveCriteria : videoCriteria;

    try {
      await videoService.createVideo({
        title: [state ? `(${state})` : null, criteria ? `[${criteria}]` : null, title].filter(Boolean).join(" "),
        videoUrl: nextVideoUrl,
        thumbnail: thumbnail || undefined,
        isLive
      });
      if (isLive) {
        setLiveTitle("");
        setLiveUrl("");
        setLiveThumbnail("");
        setLiveCriteria("");
      } else {
        setVideoTitle("");
        setVideoUrl("");
        setVideoThumbnail("");
        setVideoCriteria("");
      }
      Alert.alert(isLive ? "Live video uploaded" : "Vlog uploaded", "Users can refresh the video tab to see it.");
    } catch (error) {
      Alert.alert("Video upload failed", error instanceof Error ? error.message : "Please check the video fields.");
    }
  };

  const handleAdminVideoUpdate = async (isLive: boolean) => {
    if (!videoId) {
      Alert.alert("Missing ID", "Enter the video ID to update.");
      return;
    }

    const title = isLive ? liveTitle : videoTitle;
    const nextVideoUrl = isLive ? liveUrl : videoUrl;
    const thumbnail = isLive ? liveThumbnail : videoThumbnail;

    try {
      await videoService.updateVideo(videoId, {
        title: title || undefined,
        videoUrl: nextVideoUrl || undefined,
        thumbnail: thumbnail || undefined,
        isLive
      });
      Alert.alert("Video updated", "Users can refresh video screens to see the update.");
    } catch (error) {
      Alert.alert("Update failed", error instanceof Error ? error.message : "Please check the video ID and fields.");
    }
  };

  const handleAdminVideoDelete = async () => {
    if (!videoId) {
      Alert.alert("Missing ID", "Enter the video ID to delete.");
      return;
    }

    try {
      await videoService.deleteVideo(videoId);
      setVideoId("");
      Alert.alert("Video deleted", "The video was removed.");
    } catch (error) {
      Alert.alert("Delete failed", error instanceof Error ? error.message : "Please check the video ID.");
    }
  };

  if (isAdmin) {
    return (
      <Screen>
        <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <TopBar subtitle="Admin tools are separated by sections" />
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.title, { color: colors.text }]}>Admin Panel</Text>
              <Text style={[styles.helper, { color: colors.textMuted }]}>
                Profile is disabled for admin. Use separate sections for each upload type.
              </Text>
              <Pressable onPress={() => navigation.navigate("AdminUploadNews")} style={[styles.button, { backgroundColor: colors.primary }]}>
                <Text style={[styles.buttonText, { color: colors.backgroundAlt }]}>Open Upload News</Text>
              </Pressable>
              <Pressable onPress={() => navigation.navigate("AdminUploadVlog")} style={[styles.button, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.buttonText, { color: colors.backgroundAlt }]}>Open Upload Vlog</Text>
              </Pressable>
              <Pressable onPress={() => navigation.navigate("AdminUploadLive")} style={[styles.button, { backgroundColor: colors.primary }]}>
                <Text style={[styles.buttonText, { color: colors.backgroundAlt }]}>Open Upload Live</Text>
              </Pressable>
              <Pressable onPress={() => navigation.navigate("AdminUsers")} style={[styles.button, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.buttonText, { color: colors.text }]}>View Users</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Screen>
    );
  }

  return (
    <Screen>
      <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TopBar subtitle="Citizen journalist tools and profile settings" />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Name"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
          />
          <TextInput
            value={user?.email ?? ""}
            editable={false}
            placeholder="Email"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} 
          />
          <TextInput
            value={user?.phoneNumber ?? ""}
            editable={false}
            placeholder="Phone"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} 
          />
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="Location"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
          />
          <TextInput
            value={stateValue}
            onChangeText={setStateValue}
            placeholder="State"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
          />
          <TextInput
            value={preferredCategory}
            onChangeText={setPreferredCategory}
            placeholder="Preferred category"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
          />
          <Pressable
            onPress={isAuthenticated ? handleProfileSave : handleProtectedPrompt}
            style={[styles.button, { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.buttonText, { color: colors.backgroundAlt }]}>Save profile</Text>
          </Pressable>
          {isAdmin ? (
            <Pressable
              onPress={() => navigation.navigate("AdminUsers")}
              style={[styles.button, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <Text style={[styles.buttonText, { color: colors.text }]}>View all users</Text>
            </Pressable>
          ) : null}
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>Security</Text>
          <TextInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Current password"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            style={[styles.input, { backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
          />
          <TextInput
            value={nextPassword}
            onChangeText={setNextPassword}
            placeholder="New password"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            style={[styles.input, { backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
          />
          <TextInput
            value={confirmNextPassword}
            onChangeText={setConfirmNextPassword}
            placeholder="Confirm new password"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            style={[styles.input, { backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
          />
          <Pressable
            onPress={isAuthenticated ? handlePasswordChange : handleProtectedPrompt}
            style={[styles.button, { backgroundColor: colors.secondary }]}
          >
            <Text style={[styles.buttonText, { color: colors.backgroundAlt }]}>Update password</Text>
          </Pressable>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>Citizen Journalist</Text>
          <Text style={[styles.helper, { color: colors.textMuted }]}>
            Guests can browse freely. Posting remains protected so we do not disturb the existing auth boundary.
          </Text>
          <TextInput
            value={citizenTitle}
            onChangeText={setCitizenTitle}
            placeholder="Title"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
          />
          <TextInput
            value={citizenContent}
            onChangeText={setCitizenContent}
            placeholder="News in detail"
            placeholderTextColor={colors.textMuted}
            multiline
            style={[styles.input, styles.textArea, { backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
          />
          <TextInput
            value={citizenState}
            onChangeText={setCitizenState}
            placeholder="State"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
          />
          <TextInput
            value={citizenLanguage}
            onChangeText={setCitizenLanguage}
            placeholder="Language"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
          />
          <Pressable
            onPress={isAuthenticated ? handleCitizenSubmit : handleProtectedPrompt}
            style={[styles.button, { backgroundColor: colors.secondary }]}
          >
            <Text style={[styles.buttonText, { color: colors.backgroundAlt }]}>Submit citizen story</Text>
          </Pressable>
        </View>

        {isAdmin ? (
          <>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.title, { color: colors.text }]}>Admin Upload News</Text>
              <TextInput
                value={adminNewsId}
                onChangeText={setAdminNewsId}
                placeholder="News ID for update/delete"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                style={[styles.input, { backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
              />
              <TextInput
                value={adminTitle}
                onChangeText={setAdminTitle}
                placeholder="Title"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, { backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
              />
              <TextInput
                value={adminDescription}
                onChangeText={setAdminDescription}
                placeholder="Description"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, { backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
              />
              <TextInput
                value={adminContent}
                onChangeText={setAdminContent}
                placeholder="Full article content"
                placeholderTextColor={colors.textMuted}
                multiline
                style={[styles.input, styles.textArea, { backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
              />
              <TextInput
                value={adminImageUrl}
                onChangeText={setAdminImageUrl}
                placeholder="Image URL"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                style={[styles.input, { backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
              />
              <TextInput
                value={adminCategory}
                onChangeText={setAdminCategory}
                placeholder="Category"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, { backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
              />
              <TextInput
                value={adminState}
                onChangeText={setAdminState}
                placeholder="State"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, { backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
              />
              <Pressable onPress={handleAdminNewsCreate} style={[styles.button, { backgroundColor: colors.primary }]}>
                <Text style={[styles.buttonText, { color: colors.backgroundAlt }]}>Upload news post</Text>
              </Pressable>
              <Pressable onPress={handleAdminNewsUpdate} style={[styles.button, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.buttonText, { color: colors.backgroundAlt }]}>Update news by ID</Text>
              </Pressable>
              <Pressable onPress={handleAdminNewsDelete} style={[styles.button, { backgroundColor: colors.danger }]}>
                <Text style={[styles.buttonText, { color: colors.backgroundAlt }]}>Delete news by ID</Text>
              </Pressable>
            </View>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.title, { color: colors.text }]}>Admin Upload Vlog</Text>
              <TextInput
                value={videoId}
                onChangeText={setVideoId}
                placeholder="Video ID for update/delete"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                style={[styles.input, { backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
              />
              <TextInput
                value={videoTitle}
                onChangeText={setVideoTitle}
                placeholder="Vlog title"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, { backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
              />
              <TextInput
                value={videoUrl}
                onChangeText={setVideoUrl}
                placeholder="Video URL"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                style={[styles.input, { backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
              />
              <TextInput
                value={videoThumbnail}
                onChangeText={setVideoThumbnail}
                placeholder="Thumbnail URL"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                style={[styles.input, { backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
              />
              <TextInput
                value={videoState}
                onChangeText={setVideoState}
                placeholder="Region / State (who should see this)"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, { backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
              />
              <TextInput
                value={videoCriteria}
                onChangeText={setVideoCriteria}
                placeholder="Criteria (e.g., Tech, Sports, Breaking)"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, { backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
              />
              <Pressable onPress={() => handleAdminVideoCreate(false)} style={[styles.button, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.buttonText, { color: colors.backgroundAlt }]}>Upload vlog</Text>
              </Pressable>
              <Pressable onPress={() => handleAdminVideoUpdate(false)} style={[styles.button, { backgroundColor: colors.primary }]}>
                <Text style={[styles.buttonText, { color: colors.backgroundAlt }]}>Update vlog by ID</Text>
              </Pressable>
              <Pressable onPress={handleAdminVideoDelete} style={[styles.button, { backgroundColor: colors.danger }]}>
                <Text style={[styles.buttonText, { color: colors.backgroundAlt }]}>Delete video by ID</Text>
              </Pressable>
            </View>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.title, { color: colors.text }]}>Admin Upload Live Video</Text>
              <TextInput
                value={liveTitle}
                onChangeText={setLiveTitle}
                placeholder="Live title"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, { backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
              />
              <TextInput
                value={liveUrl}
                onChangeText={setLiveUrl}
                placeholder="Live video URL"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                style={[styles.input, { backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
              />
              <TextInput
                value={liveThumbnail}
                onChangeText={setLiveThumbnail}
                placeholder="Live thumbnail URL"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                style={[styles.input, { backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
              />
              <TextInput
                value={liveState}
                onChangeText={setLiveState}
                placeholder="Region / State (who should see this)"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, { backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
              />
              <TextInput
                value={liveCriteria}
                onChangeText={setLiveCriteria}
                placeholder="Criteria (e.g., Live TV, Election, Weather)"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, { backgroundColor: colors.backgroundAlt, borderColor: colors.border, color: colors.text }]}
              />
              <Pressable onPress={() => handleAdminVideoCreate(true)} style={[styles.button, { backgroundColor: colors.primary }]}>
                <Text style={[styles.buttonText, { color: colors.backgroundAlt }]}>Upload live video</Text>
              </Pressable>
              <Pressable onPress={() => handleAdminVideoUpdate(true)} style={[styles.button, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.buttonText, { color: colors.backgroundAlt }]}>Update live video by ID</Text>
              </Pressable>
            </View>
          </>
        ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1
  },
  content: {
    paddingBottom: 24
  },
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 14
  },
  helper: {
    lineHeight: 22
  },
  input: {
    borderRadius: radii.md,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: "top"
  },
  button: {
    borderRadius: radii.pill,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8
  },
  buttonText: {
    fontWeight: "800"
  }
});
