import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { TopBar } from "@/components/TopBar";
import { radii } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { videoService } from "@/services/videoService";
import { VideoItem } from "@/types/news";

export function VideosScreen() {
  const { colors } = useTheme();
  const [items, setItems] = useState<VideoItem[]>([]);

  useEffect(() => {
    const loadVideos = () => {
      videoService.getArchivedVideos().then(setItems).catch(() => setItems([]));
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
            <TopBar subtitle="Past live videos and uploaded clips" />
            <Text style={[styles.title, { color: colors.text }]}>Videos</Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              This tab lists videos where `is_live = false`.
            </Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Image source={{ uri: item.thumbnail || "https://placehold.co/800x450/png" }} style={styles.image} />
            <View style={styles.body}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.cardText, { color: colors.textMuted }]}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={[styles.empty, { color: colors.textMuted }]}>No past videos are available yet.</Text>}
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
