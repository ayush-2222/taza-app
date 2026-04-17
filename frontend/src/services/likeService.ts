import { api } from "./api";

export const likeService = {
  async toggleLike(userId: string, newsId: string) {
    const response = await api.post<{ liked: boolean; likesCount: number }>("/like", { userId, newsId });
    return response.data;
  }
};
