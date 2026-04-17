export const LikeModel = {
  table: "likes",
  uniqueOn: ["userId", "newsId"]
} as const;

