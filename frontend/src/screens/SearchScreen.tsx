import { useCallback, useState } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Loader } from "@/components/Loader";
import { NewsCard } from "@/components/NewsCard";
import { Screen } from "@/components/Screen";
import { colors, radii } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/types";
import { newsService } from "@/services/newsService";
import { NewsArticle } from "@/types/news";

export function SearchScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSearch = useCallback(() => {
    setIsLoading(true);
    setError(null);
    newsService
      .getNews(undefined, query)
      .then((response) => setResults(response.items))
      .catch((searchError: Error) => setError(searchError.message))
      .finally(() => setIsLoading(false));
  }, [query]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<NewsArticle>) => (
      <NewsCard article={item} onPress={() => navigation.navigate("NewsDetail", { article: item })} />
    ),
    [navigation],
  );

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <Text style={styles.subtitle}>Filter stories by keyword and topic</Text>
      </View>
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search headlines"
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={runSearch}
          style={styles.input}
        />
        <Pressable onPress={runSearch} style={styles.button}>
          <Text style={styles.buttonText}>Go</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <Loader label="Finding relevant articles..." />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          initialNumToRender={5}
          windowSize={7}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={error ? <Text style={styles.error}>{error}</Text> : null}
          ListEmptyComponent={<Text style={styles.empty}>Search results will appear here.</Text>}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 16,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
  },
  subtitle: {
    marginTop: 6,
    color: colors.textMuted,
  },
  searchRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    color: colors.text,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    justifyContent: "center",
    borderRadius: radii.md,
  },
  buttonText: {
    color: colors.text,
    fontWeight: "800",
  },
  list: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  empty: {
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 40,
  },
  error: {
    color: colors.danger,
    marginBottom: 14,
  },
});
