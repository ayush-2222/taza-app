import Redis from "ioredis";
import { env } from "./env";

let redis: Redis | null = null;

if (env.REDIS_URL) {
  redis = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 1,
    enableReadyCheck: false
  });

  redis.on("error", (err) => {
    console.warn("Redis error (ignored):", err.message);
  });
}

export { redis };
