import { GraphQLOperationKind } from "@stormstack/adapters-shared-graphql";
import { ApiClient } from "@stormstack/core-client-api";
import {
  ApiClientResult,
  ApiErrorCode,
  UploadList
} from "@stormstack/core-shared-api";
import { StormError, isRuntimeServer } from "@stormstack/core-shared-utilities";
import {
  CacheConfig,
  Environment,
  Network,
  Observable,
  RecordSource,
  RequestParameters,
  Store,
  UploadableMap,
  Variables
} from "relay-runtime";
import { RecordMap } from "relay-runtime/lib/store/RelayStoreTypes";
import { attachGarbageCollectionBehavior } from "./garbage-collection";

const createRelayFetch =
  (client: ApiClient) =>
  (
    request: RequestParameters,
    variables: Variables,
    cacheConfig: CacheConfig,
    uploadables?: UploadableMap | null
  ) => {
    const doc_id = request.id ?? request.cacheID;
    if (!doc_id) {
      throw new StormError(
        ApiErrorCode.invalid_request,
        "The document/operation name is missing from the request. Either a text representation of the document must be included, or the `id` of an existing operation must be provided."
      );
    }

    if (uploadables && Object.keys(uploadables).length > 0) {
      const files = new Map<string, File>();
      for (const [key, value] of Object.entries(uploadables)) {
        files.set(key, value as File);
      }

      return client.upload({
        input: new UploadList(files)
      });
    }

    if (
      request.operationKind.toUpperCase() ===
        GraphQLOperationKind.QUERY.toUpperCase() ||
      request.operationKind.toUpperCase() ===
        GraphQLOperationKind.LIVE_QUERY.toUpperCase() ||
      request.operationKind.toUpperCase() ===
        GraphQLOperationKind.PRELOADED_QUERY.toUpperCase()
    ) {
      return client.query({
        input: {
          doc_id,
          variables: variables
        }
      });
    } else {
      return client.mutate({
        input: {
          doc_id,
          variables: variables
        }
      });
    }
  };

const createRelaySubscribe =
  (client: ApiClient) =>
  (
    request: RequestParameters,
    variables: Variables,
    cacheConfig: CacheConfig
  ) => {
    const doc_id = request.id ?? request.cacheID;
    if (!doc_id) {
      throw new StormError(
        ApiErrorCode.invalid_request,
        "The document/operation name is missing from the request. Either a text representation of the document must be included, or the `id` of an existing operation must be provided."
      );
    }

    return Observable.create<ApiClientResult>(sink => {
      client.subscribe({
        input: {
          doc_id,
          variables: variables
        },
        sink
      });
    });
  };

export function createStore(queryCacheExpireMs?: number): Store {
  return attachGarbageCollectionBehavior(
    new Store(new RecordSource(), {
      queryCacheExpirationTime: queryCacheExpireMs ?? 5000
    })
  );
}

let environment: Environment;
export function getEnvironment(client: ApiClient, store?: Store): Environment {
  if (isRuntimeServer() || !environment) {
    const _environment = new Environment({
      network: Network.create(
        createRelayFetch(client),
        createRelaySubscribe(client)
      ),
      store: store ?? createStore(),
      isServer: isRuntimeServer()
    });
    if (!isRuntimeServer()) {
      environment = _environment;
    }

    return _environment;
  }

  return environment;
}

export const loadEnvironment = (initialRecords?: RecordMap) => {
  if (initialRecords) {
    environment.getStore().publish(new RecordSource(initialRecords));
  }

  return environment;
};
