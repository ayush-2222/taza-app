import { Prisma } from "@prisma/client";
import { env } from "../config/env";
import { prisma } from "../config/prisma";
import { getPagination } from "../utils/pagination";
import { deleteCachedByPrefix, getCachedJson, setCachedJson } from "../utils/cache";

type NewsQuery = {
  page?: number;
  pageSize?: number;
  category?: string;
  state?: string;
  query?: string;
  locationState?: string;
  freezeFeed?: boolean;
};

type CreateNewsInput = {
  title: string;
  description: string;
  content: string;
  category: string;
  state: string;
  imageUrl?: string;
};

type UpdateNewsInput = Partial<CreateNewsInput>;

export async function listNews(query: NewsQuery) {
  const {
    page = 1,
    pageSize = env.NEWS_PAGE_SIZE,
    category,
    state,
    query: search,
    locationState,
    freezeFeed = false
  } = query;
  const { skip, take, page: safePage, pageSize: safePageSize } = getPagination(page, pageSize);
  const effectiveState = state ?? locationState;

  const cacheKey = `news:list:${safePage}:${safePageSize}:${category ?? "all"}:${effectiveState ?? "all"}:${search ?? "none"}`;
  const cached = await getCachedJson<unknown>(cacheKey);
  if (cached) {
    return {
      ...(cached as object),
      freezeFeed
    };
  }

  const where: Prisma.NewsWhereInput = {
    ...(category ? { category: { equals: category, mode: "insensitive" as const } } : {}),
    ...(effectiveState ? { state: { equals: effectiveState, mode: "insensitive" as const } } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
            { content: { contains: search, mode: "insensitive" as const } }
          ]
        }
      : {})
  };

  const items: Array<Prisma.NewsGetPayload<{ include: { _count: { select: { likes: true } } } }>> = await prisma.news.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip,
    take,
    include: {
      _count: {
        select: { likes: true }
      }
    }
  });
  const total = await prisma.news.count({ where });

  const payload = {
    items: items.map((newsItem) => {
      const { _count, ...item } = newsItem;
      return {
        ...item,
        likesCount: _count.likes
      };
    }),
    total,
    page: safePage,
    pageSize: safePageSize,
    hasMore: skip + items.length < total
  };

  await setCachedJson(cacheKey, payload, 45);

  return {
    ...payload,
    freezeFeed
  };
}

export async function getNewsById(id: string) {
  return prisma.news.findUnique({
    where: { id },
    include: {
      _count: {
        select: { likes: true }
      }
    }
  });
}

export async function listCategories() {
  const categories: Array<{ category: string }> = await prisma.news.findMany({
    distinct: ["category"],
    select: { category: true },
    orderBy: { category: "asc" }
  });

  return categories.map((item) => item.category);
}

export async function createNews(input: CreateNewsInput) {
  const created = await prisma.news.create({
    data: {
      ...input,
      imageUrl: input.imageUrl ?? ""
    }
  });

  await deleteCachedByPrefix("news:list");
  return created;
}

export async function updateNews(id: string, input: UpdateNewsInput) {
  const updated = await prisma.news.update({
    where: { id },
    data: input
  });

  await deleteCachedByPrefix("news:list");
  return updated;
}

export async function deleteNews(id: string) {
  await prisma.news.delete({ where: { id } });
  await deleteCachedByPrefix("news:list");
  return { deleted: true };
}
