import ratelimitCache from "../redis/redis.server";

export async function ratelimitHeaders(
  endpoint: string,
  headers: Headers,
  duration: number,
  limit: number
) {
  const ip = headers.get("x-forwarded-for") ?? "";
  const key = `ratelimit:${endpoint}:${ip}`;

  return await ratelimitId(endpoint, key, duration, limit);
}
export async function ratelimitId(
  endpoint: string,
  id: string,
  duration: number,
  limit: number
) {
  const key = `HfitRL:${endpoint}:${id}`;

  const requests = await ratelimitCache.incr(key);
  if (requests === 1) {
    await ratelimitCache.expire(key, duration);
  }
  if (requests > limit) {
    return { tries_left: 0 };
  }
  return { tries_left: limit - requests + 1 };
}
