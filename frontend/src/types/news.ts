export type Category = {
  id: number;
  name: string;
  slug: string;
};

export type NewsArticle = {
  id: string;
  title: string;
  summary: string;
  description?: string;
  content: string;
  image_url: string;
  source: string;
  author: string;
  published_at: string;
  category: string;
  read_time: string;
  state?: string;
  likesCount?: number;
};

export type NewsResponse = {
  items: NewsArticle[];
  total: number;
  page?: number;
  pageSize?: number;
  hasMore?: boolean;
  freezeFeed?: boolean;
};

export type VideoItem = {
  id: string;
  title: string;
  videoUrl: string;
  thumbnail: string;
  isLive: boolean;
  createdAt: string;
};
