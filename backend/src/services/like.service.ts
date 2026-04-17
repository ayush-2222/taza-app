import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import { deleteCachedByPrefix } from "../utils/cache";
import { getSocket } from "../utils/socket";

export async function toggleLike(userId: string, newsId: string) {
  const [user, news] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.news.findUnique({ where: { id: newsId } })
  ]);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!news) {
    throw new ApiError(404, "News item not found");
  }

  const existing = await prisma.like.findUnique({
    where: {
      userId_newsId: {
        userId,
        newsId
      }
    }
  });

  let liked = false;

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
  } else {
    await prisma.like.create({
      data: { userId, newsId }
    });
    liked = true;
  }

  const likesCount = await prisma.like.count({ where: { newsId } });
  await deleteCachedByPrefix("news:list");

  try {
    getSocket().emit("news:liked", { newsId, likesCount, liked, userId });
  } catch {
    // Socket may not be initialized during tests or scripts.
  }

  return { liked, likesCount };
}
