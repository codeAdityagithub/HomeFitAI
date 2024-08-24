import { singleton } from "./singleton.server";

const cache = singleton("Cache", ()=>new Map());

type Options<TArgs extends any[]> = {
  revalidateAfter?: number;
  tags: (args: TArgs) => string[];
};

// The callback function type
type AsyncFunction<TArgs extends any[], TResult> = (
  ...args: TArgs
) => Promise<TResult>;

export function stable_cache<TArgs extends any[], TResult>(
  callbackFn: AsyncFunction<TArgs, TResult>,
  options: Options<TArgs>
) {
  const { revalidateAfter, tags } = options;

  return async (...args: TArgs): Promise<TResult> => {
    const cacheKey = `cache:${tags(args).join(":")}`;

    // Check cache first
    const cachedResult = await cache.get(cacheKey);
    if (
      cachedResult &&
      (!revalidateAfter ||
        Date.now() - cachedResult.date < revalidateAfter * 1000)
    ) {
      // If the result is still valid, return it
      return cachedResult.res as TResult;
    }

    // If not in cache, call the original function
    const result = await callbackFn(...args);

    // Store the result in cache with an expiration time
    cache.set(cacheKey, { res: result, date: Date.now() });
    return result;
  };
}

export function invalidateTag(tags: string[]) {
  const cacheKey = `cache:${tags.join(":")}`;
  cache.delete(cacheKey);
}
