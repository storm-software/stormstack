import { useResponseCache as useResponseCacheExt } from "@graphql-yoga/plugin-response-cache";
import { hashSessionId } from "@open-system/core-server-utilities";

export const useResponseCache = () => {
  return useResponseCacheExt({
    session: (request: Request) => {
      const sessionValue =
        request.headers.get("authorization") ??
        request.headers.get("x-api-token");

      if (sessionValue != null) {
        return hashSessionId(sessionValue);
      }

      return null;
    },
    ttl: 2_000,
    ttlPerType: {
      // only cache query operations containing User for 500ms
      User: 500,
    },
    ttlPerSchemaCoordinate: {
      "Query.tokenInfo": 5_000,
      "Query.lazy": 10_000,
    },
    invalidateViaMutation: true,
  });
};
