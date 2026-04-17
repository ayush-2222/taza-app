import { create } from "zustand";
import { Category, NewsArticle } from "@/types/news";
import { newsService } from "@/services/newsService";

type NewsState = {
  articles: NewsArticle[];
  categories: Category[];
  selectedCategory: string;
  searchQuery: string;
  freezeFeed: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  fetchBootstrap: () => Promise<void>;
  fetchNews: (params?: { refresh?: boolean; category?: string; query?: string }) => Promise<void>;
  selectCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
};

export const useNewsStore = create<NewsState>((set, get) => ({
  articles: [],
  categories: [],
  selectedCategory: "all",
  searchQuery: "",
  freezeFeed: false,
  isLoading: false,
  isRefreshing: false,
  error: null,

  fetchBootstrap: async () => {
    set({ isLoading: true, error: null });
    try {
      const [categories, news] = await Promise.all([
        newsService.getCategories(),
        newsService.getNews(),
      ]);
      set({
        categories: [{ id: 0, name: "All", slug: "all" }, ...categories],
        articles: news.items,
        freezeFeed: Boolean(news.freezeFeed),
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load the feed.",
        isLoading: false,
      });
    }
  },

  fetchNews: async (params) => {
    const { selectedCategory, searchQuery } = get();
    const nextCategory = params?.category ?? selectedCategory;
    const nextQuery = params?.query ?? searchQuery;

    set({
      isLoading: !params?.refresh,
      isRefreshing: Boolean(params?.refresh),
      error: null,
    });

    try {
      const news = await newsService.getNews(
        nextCategory === "all" ? undefined : nextCategory,
        nextQuery || undefined,
      );
      set({
        articles: news.items,
        selectedCategory: nextCategory,
        searchQuery: nextQuery,
        freezeFeed: Boolean(news.freezeFeed),
        isLoading: false,
        isRefreshing: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unable to refresh content.",
        isLoading: false,
        isRefreshing: false,
      });
    }
  },

  selectCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
