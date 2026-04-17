import { useEffect, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { radii } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { videoService } from "@/services/videoService";
import { VideoItem } from "@/types/news";

export function LiveScreen() {
  const { colors } = useTheme();
  const [items, setItems] = useState<VideoItem[]>([]);

  useEffect(() => {
    const loadVideos = () => {
      videoService.getLiveVideos().then(setItems).catch(() => setItems([]));
    };

    loadVideos();
    const interval = setInterval(loadVideos, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Screen>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <TopBar subtitle="Live newsroom and current streams" />
            <Text style={[styles.title, { color: colors.text }]}>Live</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              Active streams are pulled from videos where `is_live = true`.
            </Text>
          </>
        }
        renderItem={({ item }) => (
          <Pressable style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Image source={{ uri: item.thumbnail || "https://placehold.co/800x450/png" }} style={styles.image} />
            <View style={styles.body}>
              <Text style={[styles.liveBadge, { color: colors.primary }]}>LIVE</Text>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.cardText, { color: colors.textMuted }]} numberOfLines={1}>
                {item.videoUrl}
              </Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={[styles.empty, { color: colors.textMuted }]}>No live videos are available yet.</Text>}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24
  },
  title: {
    fontSize: 28,
    fontWeight: "900"
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 18
  },
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 16
  },
  image: {
    width: "100%",
    height: 200
  },
  body: {
    padding: 16
  },
  liveBadge: {
    fontWeight: "900",
    marginBottom: 8
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800"
  },
  cardText: {
    marginTop: 6
  },
  empty: {
    marginTop: 36,
    textAlign: "center"
  }
});
