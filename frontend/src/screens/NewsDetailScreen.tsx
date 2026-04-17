import { useState } from "react";
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "@/components/Screen";
import { radii } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { RootStackParamList } from "@/navigation/types";
import { likeService } from "@/services/likeService";
import { useAuthStore } from "@/store/authStore";
import { useBookmarkStore } from "@/store/bookmarkStore";

type Props = NativeStackScreenProps<RootStackParamList, "NewsDetail">;

export function NewsDetailScreen({ route, navigation }: Props) {
  const { colors } = useTheme();
  const { article } = route.params;
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  const isBookmarked = useBookmarkStore((state) => state.isBookmarked(article.id));
  const [likesCount, setLikesCount] = useState(article.likesCount ?? 0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const hasFullAccess = isAuthenticated;
  const preview = article.content.length > 260 ? `${article.content.slice(0, 260)}...` : article.content;

  const handleLike = async () => {
    if (!user?.id) {
      Alert.alert("Login required", "Please login to like this post.");
      return;
    }

    try {
      const result = await likeService.toggleLike(user.id, article.id);
      setLikesCount(result.likesCount);
    } catch {
      Alert.alert("Like failed", "Please try again.");
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: article.image_url }} style={styles.image} />
        <View style={styles.row}>
          <Text style={[styles.source, { color: colors.secondary }]}>{article.source}</Text>
          <Pressable
            onPress={() => {
              if (!hasFullAccess) {
                Alert.alert("Login to save favorites");
                return;
              }
              toggleBookmark(article);
            }}
            style={[
              styles.bookmarkButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: hasFullAccess ? 1 : 0.45
              }
            ]}
          >
            <Text style={[styles.bookmarkText, { color: colors.text }]}>
              {isBookmarked ? "Bookmarked" : "Bookmark"}
            </Text>
          </Pressable>
        </View>
        <Pressable
          onPress={handleLike}
          style={[styles.likeButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Text style={[styles.bookmarkText, { color: colors.text }]}>Like post ({likesCount})</Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>{article.title}</Text>
        <Text style={[styles.meta, { color: colors.textMuted }]}>
          {article.author} | {new Date(article.published_at).toLocaleDateString()} | {article.read_time}
        </Text>
        <Text style={[styles.contentText, { color: colors.text }]}>{hasFullAccess ? article.content : preview}</Text>
        {!hasFullAccess ? (
          <Pressable
            onPress={() => setShowLoginPrompt(true)}
            style={[styles.readFullButton, { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.readFullText, { color: colors.backgroundAlt }]}>Login to read full article</Text>
          </Pressable>
        ) : null}
      </ScrollView>

      <Modal visible={showLoginPrompt} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Login Required</Text>
            <Text style={[styles.modalText, { color: colors.textMuted }]}>Login to read full article.</Text>
            <Pressable
              onPress={() => {
                setShowLoginPrompt(false);
                navigation.navigate("Auth", { mode: "signup" });
              }}
              style={[styles.readFullButton, { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.readFullText, { color: colors.backgroundAlt }]}>Login</Text>
            </Pressable>
            <Pressable onPress={() => setShowLoginPrompt(false)}>
              <Text style={[styles.cancelText, { color: colors.textMuted }]}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 16,
    paddingBottom: 32
  },
  image: {
    width: "100%",
    height: 260,
    borderRadius: radii.lg
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18
  },
  source: {
    fontWeight: "800",
    textTransform: "uppercase"
  },
  bookmarkButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radii.pill,
    borderWidth: 1
  },
  likeButton: {
    alignSelf: "flex-start",
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radii.pill,
    borderWidth: 1
  },
  bookmarkText: {
    fontWeight: "700"
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "900",
    marginTop: 16
  },
  meta: {
    marginTop: 12
  },
  contentText: {
    marginTop: 18,
    fontSize: 16,
    lineHeight: 28
  },
  readFullButton: {
    marginTop: 18,
    borderRadius: radii.pill,
    paddingVertical: 14,
    alignItems: "center"
  },
  readFullText: {
    fontWeight: "900"
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(17, 24, 39, 0.42)",
    justifyContent: "center",
    paddingHorizontal: 20
  },
  modalCard: {
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: 20
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "900"
  },
  modalText: {
    marginTop: 10,
    lineHeight: 22
  },
  cancelText: {
    textAlign: "center",
    marginTop: 14,
    fontWeight: "800"
  }
});
