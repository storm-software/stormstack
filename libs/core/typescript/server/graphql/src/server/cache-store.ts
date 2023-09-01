/*import { JsonParser } from "@open-system/core-shared-serialization/json-parser";
import { CacheStore } from "../types";

export const createCacheStore = <T = any>(
  cache: CacheStore<T>,
  prefix: string
) => ({
  get: (key: string): T | undefined => {
    const value = cache.get(`${prefix}:${key}`);

    if (value) {
      return JsonParser.parse(value);
    }

    return undefined;
  },
  set: (key: string, value: T): void => {
    cache.set(`${prefix}:${key}`, JsonParser.stringify(value));
  }
});*/
