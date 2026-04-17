import Redis from "ioredis";
import { env } from "./env";

let redis: Redis | null = null;

export function getRedisClient() {
  if (!env.REDIS_URL) {
    return null;
  }

  if (!redis) {
    redis = new Redis(env.REDIS_URL, {
      lazyConnect: true,
      maxRetriesPerRequest: 1
    });
    redis.on("error", () => {
      redis = null;
    });
    redis.connect().catch(() => {
      redis = null;
    });
  }

  return redis;
}

