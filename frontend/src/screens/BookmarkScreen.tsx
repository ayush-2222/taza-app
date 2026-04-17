import { useCallback } from "react";
import { FlatList, ListRenderItemInfo, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { NewsCard } from "@/components/NewsCard";
import { Screen } from "@/components/Screen";
import { colors } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/types";
import { useBookmarkStore } from "@/store/bookmarkStore";
import { NewsArticle } from "@/types/news";

export function BookmarkScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const items = useBookmarkStore((state) => state.items);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<NewsArticle>) => (
      <NewsCard article={item} onPress={() => navigation.navigate("NewsDetail", { article: item })} />
    ),
    [navigation],
  );

  return (
    <Screen>
      <FlatList
        data={items}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        initialNumToRender={4}
        windowSize={5}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Bookmarks</Text>
            <Text style={styles.subtitle}>Your saved reads stay available locally.</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No saved articles yet</Text>
            <Text style={styles.emptyText}>Bookmark stories from the detail screen to collect them here.</Text>
          </View>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: 6,
  },
  empty: {
    marginTop: 48,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: colors.text,
    fontWeight: "800",
    fontSize: 18,
  },
  emptyText: {
    marginTop: 8,
    color: colors.textMuted,
    textAlign: "center",
  },
});
