import { redis } from "../config/redis";

function safeKey(key: string) {
  return `taza:${key}`;
}

export async function getCachedJson<T>(key: string): Promise<T | null> {
  if (!redis) {
    return null;
  }

  try {
    const value = await redis.get(safeKey(key));
    return value ? (JSON.parse(value) as T) : null;
  } catch (error) {
    console.warn("Redis get failed, using DB fallback:", error instanceof Error ? error.message : String(error));
    return null;
  }
}

export async function setCachedJson(key: string, value: unknown, ttlSeconds = 60) {
  if (!redis) {
    return;
  }

  try {
    await redis.set(safeKey(key), JSON.stringify(value), "EX", ttlSeconds);
  } catch (error) {
    console.warn("Redis set failed, continuing without cache:", error instanceof Error ? error.message : String(error));
  }
}

export async function deleteCachedByPrefix(prefix: string) {
  if (!redis) {
    return;
  }

  try {
    const keys = await redis.keys(safeKey(`${prefix}*`));
    if (keys.length) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.warn("Redis cache invalidation failed, continuing:", error instanceof Error ? error.message : String(error));
  }
}
