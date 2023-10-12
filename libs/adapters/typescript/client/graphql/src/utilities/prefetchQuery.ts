import {
  CacheConfig,
  fetchQuery,
  FetchQueryFetchPolicy,
  GraphQLTaggedNode,
  OperationType
} from "relay-runtime";
import { RecordMap } from "relay-runtime/lib/store/RelayStoreTypes";
import { getApiClient } from "./create-api-client";
import { getEnvironment } from "./create-relay-environment";

const client = getApiClient();
export const prefetchQuery = async <T extends OperationType>(
  query: GraphQLTaggedNode,
  variables: T["variables"] = {},
  cacheConfig?: {
    networkCacheConfig?: CacheConfig | null | undefined;
    fetchPolicy?: FetchQueryFetchPolicy | null | undefined;
  } | null
): Promise<{
  initialRecords: RecordMap;
  queryResponse?: Awaited<T["response"]>;
}> => {
  const environment = getEnvironment(client);
  const queryResponse = await fetchQuery(
    environment,
    query,
    variables,
    cacheConfig
  ).toPromise();
  const initialRecords = environment.getStore().getSource().toJSON();

  return {
    queryResponse,
    initialRecords
  };
};
