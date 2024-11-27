import Redis from "ioredis";
import invariant from "tiny-invariant";
import { singleton } from "../singleton.server";

invariant(process.env.REDIS_UPSTASH_URL);

const redisCache = singleton("redisCache", () => {
  const redis = new Redis(process.env.REDIS_UPSTASH_URL!, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => (times > 10 ? null : Math.min(times * 500, 4000)),
  });

  redis.on("error", (err) => {
    console.error("Redis upstash error:", err.message ?? err);
  });

  redis.on("connect", () => {
    console.log("Connected to Redis upstash");
  });

  return redis;
});

export async function setCache(key: string, value: any, ttl?: number) {
  try {
    const serialized = JSON.stringify(value);
    if (ttl) {
      await redisCache.set(key, serialized, "EX", ttl);
    } else {
      await redisCache.set(key, serialized);
    }
  } catch (error) {
    console.error("Error setting cache:", error);
  }
}

export async function getCache(key: string) {
  try {
    const value = await redisCache.get(key);
    if (!value) return value;
    return JSON.parse(value);
  } catch (error) {
    console.error("Error getting cache:", error);
    return null;
  }
}

export async function deleteCache(key: string) {
  try {
    await redisCache.del(key);
  } catch (error) {
    console.error("Error deleting cache:", error);
  }
}

export default redisCache;
