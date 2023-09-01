import { Plugin } from "@envelop/types";
import { useResponseCache as useResponseCacheExt } from "@graphql-yoga/plugin-response-cache";
import { UserContext } from "@open-system/core-server-application";
import { hashSessionId } from "@open-system/core-server-utilities";
import { GraphQLServerContext } from "../types";

export const useResponseCache = <
  TUser extends UserContext = UserContext,
  TServerContext extends GraphQLServerContext<TUser> = GraphQLServerContext<TUser>
>(): Plugin<TServerContext> => {
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
      User: 500
    },
    ttlPerSchemaCoordinate: {
      "Query.tokenInfo": 5_000,
      "Query.lazy": 10_000
    },
    invalidateViaMutation: true
  }) as Plugin<TServerContext>;
};
