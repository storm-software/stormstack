"use client";

import type {
  Client,
  ClientResponse,
  ResponseError,
  SubscriptionRequestOptions,
} from "@wundergraph/sdk/client";
import { FC, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  PreloadFetchPolicy,
  PreloadedQuery,
  RelayEnvironmentProvider,
  useRelayEnvironment,
  usePreloadedQuery as useRelayPreloadedQuery,
} from "react-relay";
import {
  ConcreteRequest,
  GraphQLTaggedNode,
  IEnvironment,
  OperationType,
  createOperationDescriptor,
  getRequest,
} from "relay-runtime";
import { RecordMap } from "relay-runtime/lib/store/RelayStoreTypes";
import { SerializablePreloadedQuery } from "../types";
import { RelayResponseCache } from "../utilities/relay-response-cache";
import { createRelayUtilities } from "../utilities/relay-utilities";

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

export const createRelayHooks = ({ client }: CreateWunderGraphRelayOptions) => {
  const { initEnvironment, subscribeTo } = createRelayUtilities({ client });

  const useSubscribeTo = <TQuery extends OperationType>(
    props: UseSubscribeToProps
  ): {
    isLoading: boolean;
    isSubscribed: boolean;
    data?: TQuery["response"];
    error?: ClientResponse["error"];
  } => {
    const {
      operationName,
      input,
      enabled,
      liveQuery,
      subscribeOnce,
      onSuccess,
      onError,
    } = props;
    const startedAtRef = useRef<number | null>(null);
    const onSuccessRef = useRef(onSuccess);
    const onErrorRef = useRef(onError);

    const [state, setState] = useState({
      isLoading: false,
      isSubscribed: false,
    });

    const [data, setData] = useState<ClientResponse["data"]>();
    const [error, setError] = useState<ClientResponse["error"]>();

    useEffect(() => {
      if (enabled) {
        setState({ isLoading: true, isSubscribed: false });
      }
    }, [enabled]);

    useEffect(() => {
      let unsubscribe: ReturnType<typeof subscribeTo>;

      if (enabled) {
        unsubscribe = subscribeTo({
          operationName,
          input,
          liveQuery,
          subscribeOnce,
          onError: (error: any) => {
            setState({ isLoading: false, isSubscribed: false });
            onErrorRef.current?.(error);
            startedAtRef.current = null;
          },
          onResult: (result: any) => {
            if (!startedAtRef.current) {
              setState({ isLoading: false, isSubscribed: true });
              onSuccessRef.current?.(result);
              startedAtRef.current = new Date().getTime();
            }

            setData(result.data);
            setError(result.error);
          },
          onAbort() {
            setState({ isLoading: false, isSubscribed: false });
            startedAtRef.current = null;
          },
        });
      }

      return () => {
        unsubscribe?.();
      };
    }, [enabled, liveQuery, subscribeOnce]);

    return {
      data,
      error,
      ...state,
    };
  };

  const useLiveQuery = <TQuery extends OperationType>({
    query,
    queryReference,
    enabled = true,
    options = {},
  }: {
    query: GraphQLTaggedNode;
    queryReference: PreloadedQuery<TQuery>;
    enabled?: boolean;
    options?: Omit<
      UseSubscribeToProps,
      "operationName" | "input" | "enabled" | "abortSignal" | "liveQuery"
    >;
  }) => {
    const data = useRelayPreloadedQuery(query, queryReference);
    const { id, variables } = queryReference;
    const request = getRequest(query);
    const operationDescriptor = createOperationDescriptor(request, variables);
    const environment = useRelayEnvironment();

    const { data: liveData, ...subscriptionResponse } = useSubscribeTo<TQuery>({
      operationName: `relay/${id}`,
      input: variables,
      ...options,
      enabled: enabled ?? false,
      liveQuery: enabled ?? false,
    });

    useEffect(() => {
      if (liveData) {
        environment.commitPayload(operationDescriptor, liveData);
      }
    }, [liveData]);

    return {
      ...subscriptionResponse,
      data: data,
    };
  };

  const useEnvironment = (initialRecords?: RecordMap) => {
    const store = useMemo(
      () => initEnvironment(initialRecords),
      [initialRecords]
    );
    return store;
  };

  const RelayProvider: FC<{
    initialRecords?: RecordMap;
    children: ReactNode;
  }> = ({ initialRecords, children }) => {
    const environment = useEnvironment(initialRecords);
    return (
      <RelayEnvironmentProvider environment={environment}>
        {children}
      </RelayEnvironmentProvider>
    );
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

  // This hook convert serializable preloaded query
  // into Relay's PreloadedQuery object.
  // It is also writes this serializable preloaded query
  // into QueryResponseCache, so we the network layer
  // can use these cache results when fetching data
  // in `usePreloadedQuery`.
  const useSerializablePreloadedQuery = <
    TRequest extends ConcreteRequest,
    TQuery extends OperationType
  >(
    environment: IEnvironment,
    preloadQuery: SerializablePreloadedQuery<TRequest, TQuery>,
    fetchPolicy: PreloadFetchPolicy = "store-or-network"
  ): PreloadedQuery<TQuery> => {
    useMemo(() => {
      writePreloadedQueryToCache(preloadQuery);
    }, [preloadQuery]);

    return {
      environment,
      fetchKey: preloadQuery.params.id ?? preloadQuery.params.cacheID,
      fetchPolicy,
      isDisposed: false,
      name: preloadQuery.params.name,
      kind: "PreloadedQuery",
      variables: preloadQuery.variables,
      dispose: () => {
        return;
      },
    };
  };

  return {
    RelayProvider,
    useSubscribeTo,
    useSerializablePreloadedQuery,
    useLiveQuery,
    useEnvironment,
  };
};
