import { getRedisClient } from "../config/redis";

function safeKey(key: string) {
  return `taza:${key}`;
}

export async function getCachedJson<T>(key: string): Promise<T | null> {
  const redis = getRedisClient();
  if (!redis) {
    return null;
  }

  const value = await redis.get(safeKey(key));
  return value ? (JSON.parse(value) as T) : null;
}

export async function setCachedJson(key: string, value: unknown, ttlSeconds = 60) {
  const redis = getRedisClient();
  if (!redis) {
    return;
  }

  await redis.set(safeKey(key), JSON.stringify(value), "EX", ttlSeconds);
}

export async function deleteCachedByPrefix(prefix: string) {
  const redis = getRedisClient();
  if (!redis) {
    return;
  }

  const keys = await redis.keys(safeKey(`${prefix}*`));
  if (keys.length) {
    await redis.del(...keys);
  }
}
