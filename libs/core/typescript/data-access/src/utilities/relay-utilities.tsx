import { IsServer } from "@open-system/core-utilities";
import type {
  Client,
  ClientResponse,
  ResponseError,
  SubscriptionRequestOptions,
} from "@wundergraph/sdk/client";
// import { fetchQuery as relayFetchQuery } from "react-relay";
import {
  CacheConfig,
  ConcreteRequest,
  Environment,
  FetchFunction,
  FetchQueryFetchPolicy,
  GraphQLResponse,
  GraphQLTaggedNode,
  Network,
  Observable,
  OperationType,
  RecordSource,
  RequestParameters,
  Store,
  SubscribeFunction,
  Variables,
  VariablesOf,
  createOperationDescriptor,
  getRequest,
} from "relay-runtime";
import { RecordMap } from "relay-runtime/lib/store/RelayStoreTypes";
import { SerializablePreloadedQuery } from "../types";
import { RelayResponseCache } from "./relay-response-cache";

export interface SubscribeToOptions extends SubscriptionRequestOptions {
  onResult(response: ClientResponse): void;
  onSuccess?(response: ClientResponse): void;
  onError?(error: ResponseError): void;
  onAbort?(): void;
}

export interface UseSubscribeToProps extends SubscriptionRequestOptions {
  enabled?: boolean;
  onSuccess?(response: ClientResponse): void;
  onError?(error: ResponseError): void;
}

export interface CreateWunderGraphRelayOptions {
  client: Client;
}

export const createRelayUtilities = ({
  client,
}: CreateWunderGraphRelayOptions) => {
  const fetchQuery: FetchFunction = async (
    params: RequestParameters,
    variables: Variables,
    _?: any
  ) => {
    const { id, operationKind } = params;
    const response =
      operationKind === "query"
        ? await client.query({
            operationName: `relay/${id}`,
            input: variables,
          })
        : await client.mutate({
            operationName: `relay/${id}`,
            input: variables,
          });
    return {
      ...response,
      errors: response.error ? [response.error] : [],
    };
  };

  const subscribe: SubscribeFunction = (params, variables) => {
    return Observable.create(sink => {
      const { id } = params;
      const abort = new AbortController();
      client
        .subscribe(
          {
            operationName: `relay/${id}`,
            input: variables,
            abortSignal: abort.signal,
          },
          response => {
            const graphQLResponse = {
              ...response,
              errors: response.error ? [response.error] : [],
            };
            sink.next(graphQLResponse);
          }
        )
        .catch(e => {
          sink.error(e);
        });
      return () => {
        sink.complete();
        abort.abort();
      };
    });
  };

  const subscribeTo = (options: SubscribeToOptions) => {
    const abort = new AbortController();
    const { onSuccess, onError, onResult, onAbort, ...subscription } = options;
    subscription.abortSignal = abort.signal;
    client.subscribe(subscription, onResult).catch(onError);
    return () => {
      onAbort?.();
      abort.abort();
    };
  };

  const createNetwork = () => {
    const fetchQueryWithCache = async (
      params: RequestParameters,
      variables: Variables,
      cacheConfig: CacheConfig
    ) => {
      const isQuery = params.operationKind === "query";
      const cacheKey = params.id ?? params.cacheID;
      const forceFetch = cacheConfig && cacheConfig.force;

      if (RelayResponseCache != null && isQuery && !forceFetch) {
        const fromCache = RelayResponseCache.get(cacheKey, variables);
        if (fromCache != null) {
          return Promise.resolve(fromCache);
        }
      }

      return fetchQuery(params, variables, cacheConfig);
    };

    const network = Network.create(
      fetchQueryWithCache as FetchFunction,
      subscribe
    );
    return network;
  };

  let relayEnvironment: Environment;

  const createEnvironment = () => {
    return new Environment({
      network: createNetwork(),
      store: new Store(new RecordSource()),
      isServer: IsServer,
    });
  };

  const initEnvironment = (initialRecords?: RecordMap) => {
    const environment = relayEnvironment ?? createEnvironment();

    if (initialRecords) {
      environment.getStore().publish(new RecordSource(initialRecords));
    }
    // For SSG and SSR always create a new Relay environment
    if (IsServer) return environment;
    // Create the Relay environment once in the client
    if (!relayEnvironment) relayEnvironment = environment;

    return relayEnvironment;
  };

  const getEnvironment = () => initEnvironment();

  const fetchSSRQuery = async <T extends OperationType>(
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
    const environment = initEnvironment();

    const concreteRequest = getRequest(query);
    const operationDescriptor = createOperationDescriptor(
      concreteRequest,
      variables
    );
    const params = operationDescriptor?.request?.node?.params;

    const queryResponse = await fetchQuery(params, variables, undefined as any);
    const initialRecords = environment.getStore().getSource().toJSON();

    return {
      queryResponse: queryResponse as Awaited<T["response"]>,
      initialRecords,
    };
  };

  /**
   * Experimental utility to fetch queries at build time
   * This function doesn't use Relay store & should be only used when you don't have Relay on the client side (working with frameworks like Astro or 11ty)
   */
  const fetchSSGQuery = async <T extends OperationType>(
    query: GraphQLTaggedNode,
    variables: T["variables"]
  ): Promise<Awaited<T["response"]>> => {
    const concreteRequest = getRequest(query);

    const operationDescriptor = createOperationDescriptor(
      concreteRequest,
      variables
    );

    const id = operationDescriptor?.request?.node?.params?.id;

    const { data, error } = await client.query({
      operationName: `relay/${id}`,
      input: variables,
    });

    if (error) {
      throw Error(error);
    }

    return data;
  };

  // Call into raw network fetch to get serializable GraphQL query response
  // This response will be sent to the client to "warm" the QueryResponseCache
  // to avoid the client fetches.
  const loadSerializableQuery = async <
    TRequest extends ConcreteRequest,
    TQuery extends OperationType
  >(
    query: GraphQLTaggedNode,
    variables: VariablesOf<TQuery>
  ): Promise<SerializablePreloadedQuery<TRequest, TQuery>> => {
    const concreteRequest = getRequest(query);

    const operationDescriptor = createOperationDescriptor(
      concreteRequest,
      variables
    );

    const params = operationDescriptor?.request?.node?.params;
    const { data, error } = await client.query({
      operationName: `relay/${params?.id}`,
      input: variables,
    });

    if (error) {
      throw Error(error);
    }

    return {
      params,
      variables,
      response: {
        data,
        errors: error ? [error] : null,
      } as GraphQLResponse,
    };
  };

  function writePreloadedQueryToCache<
    TRequest extends ConcreteRequest,
    TQuery extends OperationType
  >(preloadedQueryObject: SerializablePreloadedQuery<TRequest, TQuery>) {
    const cacheKey =
      preloadedQueryObject.params.id ?? preloadedQueryObject.params.cacheID;
    RelayResponseCache?.set(
      cacheKey,
      preloadedQueryObject.variables,
      preloadedQueryObject.response
    );
  }

  return {
    writePreloadedQueryToCache,
    fetchQuery,
    fetchSSRQuery,
    fetchSSGQuery,
    loadSerializableQuery,
    subscribe,
    subscribeTo,
    createNetwork,
    getEnvironment,
    initEnvironment,
    createEnvironment,
  };
};
