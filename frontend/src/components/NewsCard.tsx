import { memo } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { radii } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { NewsArticle } from "@/types/news";

type Props = {
  article: NewsArticle;
  onPress: () => void;
  isFavorite?: boolean;
  favoriteDisabled?: boolean;
  onFavoritePress?: () => void;
};

export const NewsCard = memo(({ article, onPress, isFavorite = false, favoriteDisabled = false, onFavoritePress }: Props) => {
  const { colors } = useTheme();

  return (
    <Animated.View entering={FadeInDown.duration(450).springify()} style={styles.wrapper}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            shadowColor: colors.shadow
          }
        ]}
      >
        <Image source={{ uri: article.image_url }} style={styles.image} />
        <View style={styles.body}>
          <View style={styles.topRow}>
            <Text style={[styles.source, { color: colors.secondary }]}>{article.source}</Text>
            <Text style={[styles.meta, { color: colors.textMuted }]}>{article.read_time}</Text>
          </View>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
            {article.title}
          </Text>
          <Text style={[styles.summary, { color: colors.textMuted }]} numberOfLines={3}>
            {article.summary}
          </Text>
          <View style={styles.actionRow}>
            <Pressable
              onPress={onPress}
              android_ripple={{ color: colors.surface }}
              style={({ pressed }) => [
                styles.readButton,
                {
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.78 : 1
                }
              ]}
            >
              <Text style={[styles.readText, { color: colors.backgroundAlt }]}>Read More</Text>
            </Pressable>
            {onFavoritePress ? (
              <Pressable
                onPress={onFavoritePress}
                android_ripple={{ color: colors.surface }}
                style={({ pressed }) => [
                  styles.favoriteButton,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    opacity: favoriteDisabled ? 0.45 : pressed ? 0.72 : 1
                  }
                ]}
              >
                <Text style={[styles.favoriteText, { color: isFavorite ? colors.primary : colors.text }]}>
                  {isFavorite ? "Saved" : "Favorite"}
                </Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 18
  },
  card: {
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 5
  },
  image: {
    width: "100%",
    height: 210
  },
  body: {
    padding: 18,
    gap: 11
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  source: {
    fontWeight: "900",
    textTransform: "uppercase",
    fontSize: 12,
    letterSpacing: 0.6
  },
  meta: {
    fontSize: 12,
    fontWeight: "700"
  },
  title: {
    fontSize: 21,
    fontWeight: "900",
    lineHeight: 27
  },
  summary: {
    lineHeight: 23,
    fontSize: 14
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 2
  },
  readButton: {
    borderRadius: radii.pill,
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  readText: {
    fontSize: 13,
    fontWeight: "900"
  },
  favoriteButton: {
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  favoriteText: {
    fontSize: 13,
    fontWeight: "900"
  }
});
