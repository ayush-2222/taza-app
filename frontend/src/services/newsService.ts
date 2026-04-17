import { api } from "./api";
import { Category, NewsArticle, NewsResponse } from "@/types/news";

type ApiNewsItem = {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  category: string;
  state?: string;
  createdAt: string;
  likesCount?: number;
};

export type AdminNewsPayload = {
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  imageFile?: {
    uri: string;
    name?: string;
    type?: string;
  };
  category: string;
  state: string;
};

function toArticle(item: ApiNewsItem): NewsArticle {
  return {
    id: item.id,
    title: item.title,
    summary: item.description,
    description: item.description,
    content: item.content,
    image_url: item.imageUrl,
    source: item.category,
    author: "Taaza TV",
    published_at: item.createdAt,
    category: item.category,
    read_time: "4 min read",
    state: item.state,
    likesCount: item.likesCount
  };
}

export const newsService = {
  async getNews(category?: string, query?: string): Promise<NewsResponse> {
    const response = await api.get<{ items: ApiNewsItem[]; total: number; page?: number; pageSize?: number; hasMore?: boolean; freezeFeed?: boolean }>("/news", {
      params: { category, query },
    });
    return {
      ...response.data,
      items: response.data.items.map(toArticle)
    };
  },

  async getNewsById(id: string): Promise<NewsArticle> {
    const response = await api.get<ApiNewsItem>(`/news/${id}`);
    return toArticle(response.data);
  },

  async getCategories(): Promise<Category[]> {
    const response = await api.get<string[]>("/categories");
    return response.data.map((name, index) => ({
      id: index + 1,
      name,
      slug: name.toLowerCase()
    }));
  },

  async createNews(payload: AdminNewsPayload) {
    const hasFile = Boolean(payload.imageFile?.uri);
    const response = hasFile
      ? await api.post<ApiNewsItem>(
          "/admin/news",
          (() => {
            const form = new FormData();
            form.append("title", payload.title);
            form.append("description", payload.description);
            form.append("content", payload.content);
            form.append("category", payload.category);
            form.append("state", payload.state);
            if (payload.imageUrl) {
              form.append("imageUrl", payload.imageUrl);
            }
            form.append("image", {
              uri: payload.imageFile!.uri,
              name: payload.imageFile!.name ?? "news-image.jpg",
              type: payload.imageFile!.type ?? "image/jpeg"
            } as any);
            return form;
          })(),
          { headers: { "Content-Type": "multipart/form-data" } }
        )
      : await api.post<ApiNewsItem>("/admin/news", payload);
    return toArticle(response.data);
  },

  async updateNews(id: string, payload: Partial<AdminNewsPayload>) {
    const hasFile = Boolean(payload.imageFile?.uri);
    const response = hasFile
      ? await api.patch<ApiNewsItem>(
          `/admin/news/${id}`,
          (() => {
            const form = new FormData();
            if (payload.title) form.append("title", payload.title);
            if (payload.description) form.append("description", payload.description);
            if (payload.content) form.append("content", payload.content);
            if (payload.category) form.append("category", payload.category);
            if (payload.state) form.append("state", payload.state);
            if (payload.imageUrl) form.append("imageUrl", payload.imageUrl);
            form.append("image", {
              uri: payload.imageFile!.uri,
              name: payload.imageFile!.name ?? "news-image.jpg",
              type: payload.imageFile!.type ?? "image/jpeg"
            } as any);
            return form;
          })(),
          { headers: { "Content-Type": "multipart/form-data" } }
        )
      : await api.patch<ApiNewsItem>(`/admin/news/${id}`, payload);
    return toArticle(response.data);
  },

  async deleteNews(id: string) {
    const response = await api.delete<{ deleted: boolean }>(`/admin/news/${id}`);
    return response.data;
  }
};
