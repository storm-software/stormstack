import { useResponseCache as useResponseCacheExt } from "@graphql-yoga/plugin-response-cache";
import { createSHA256Hash } from "@open-system/core-server-utilities/create-string-hash";

export const useResponseCache = () => {
  return useResponseCacheExt({
    session: (request: Request) => {
      const sessionValue =
        request.headers.get("authorization") ??
        request.headers.get("x-api-token");

      if (sessionValue != null) {
        return createSHA256Hash(sessionValue);
      }

      return null;
    },
    ttl: 5_000,
    ttlPerType: {
      // only cache query operations containing User for 500ms
      User: 1_000
    },
    ttlPerSchemaCoordinate: {
      "Query.tokenInfo": 5_000,
      "Query.lazy": 10_000
    },
    invalidateViaMutation: true
  });
};
