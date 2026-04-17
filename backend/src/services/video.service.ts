import { prisma } from "../config/prisma";
import { deleteCachedByPrefix, getCachedJson, setCachedJson } from "../utils/cache";

type CreateVideoInput = {
  title: string;
  videoUrl: string;
  thumbnail?: string;
  isLive?: boolean;
};

type UpdateVideoInput = Partial<CreateVideoInput>;

export async function listVideos() {
  const cacheKey = "videos:all";
  const cached = await getCachedJson<unknown[]>(cacheKey);
  if (cached) {
    return cached;
  }

  const videos = await prisma.video.findMany({
    orderBy: [{ isLive: "desc" }, { createdAt: "desc" }]
  });
  await setCachedJson(cacheKey, videos, 60);
  return videos;
}

export async function listLiveVideos() {
  const cacheKey = "videos:live";
  const cached = await getCachedJson<unknown[]>(cacheKey);
  if (cached) {
    return cached;
  }

  const videos = await prisma.video.findMany({
    where: { isLive: true },
    orderBy: { createdAt: "desc" }
  });
  await setCachedJson(cacheKey, videos, 15);
  return videos;
}

export async function listArchivedVideos() {
  const cacheKey = "videos:archived";
  const cached = await getCachedJson<unknown[]>(cacheKey);
  if (cached) {
    return cached;
  }

  const videos = await prisma.video.findMany({
    where: { isLive: false },
    orderBy: { createdAt: "desc" }
  });
  await setCachedJson(cacheKey, videos, 30);
  return videos;
}

export async function createVideo(input: CreateVideoInput) {
  const video = await prisma.video.create({
    data: {
      title: input.title,
      videoUrl: input.videoUrl,
      thumbnail: input.thumbnail ?? "",
      isLive: input.isLive ?? false
    }
  });

  await deleteCachedByPrefix("videos:");
  return video;
}

export async function updateVideo(id: string, input: UpdateVideoInput) {
  const video = await prisma.video.update({
    where: { id },
    data: input
  });

  await deleteCachedByPrefix("videos:");
  return video;
}

export async function deleteVideo(id: string) {
  await prisma.video.delete({ where: { id } });
  await deleteCachedByPrefix("videos:");
  return { deleted: true };
}
