import { prisma } from "../config/prisma";
import { deleteCachedByPrefix } from "../utils/cache";
import { getSocket } from "../utils/socket";

type CreateCitizenNewsInput = {
  title: string;
  content: string;
  state: string;
  language: string;
  imageUrl?: string;
};

export async function createCitizenNews(input: CreateCitizenNewsInput) {
  const entry = await prisma.citizenNews.create({
    data: input
  });

  await deleteCachedByPrefix("news:list");

  try {
    getSocket().emit("citizen-news:created", entry);
  } catch {
    // Socket may not be initialized during tests or scripts.
  }

  return entry;
}
