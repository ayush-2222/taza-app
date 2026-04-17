import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { NewsArticle } from "@/types/news";

type BookmarkState = {
  items: NewsArticle[];
  toggleBookmark: (article: NewsArticle) => void;
  isBookmarked: (id: string) => boolean;
};

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleBookmark: (article) =>
        set((state) => {
          const exists = state.items.some((item) => item.id === article.id);
          return {
            items: exists
              ? state.items.filter((item) => item.id !== article.id)
              : [article, ...state.items],
          };
        }),
      isBookmarked: (id) => get().items.some((item) => item.id === id),
    }),
    {
      name: "taza-bookmarks",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
