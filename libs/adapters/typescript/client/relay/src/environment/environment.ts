import { isRuntimeServer, throttle } from "@stormstack/core-shared-utilities";
import {
  CacheConfig,
  Environment,
  GraphQLResponse,
  Network,
  RecordSource,
  RequestParameters,
  Store,
  Variables
} from "relay-runtime";
import { RelayGraphQLClient } from "../client";
import { getRelayResponseCache } from "../utilities";

const client = new RelayGraphQLClient();

export function createNetwork(url: string | URL) {
  const getRelayObservable = client.relayFetch(url);
  function fetchResponse(
    params: RequestParameters,
    variables: Variables,
    cacheConfig: CacheConfig
  ): Promise<GraphQLResponse> {
    const isQuery = params.operationKind === "query";
    const cacheKey = params.id ?? params.cacheID;
    const forceFetch = cacheConfig && cacheConfig.force;

    const responseCache = getRelayResponseCache();
    if (responseCache && isQuery && !forceFetch) {
      const fromCache = responseCache.get(cacheKey, variables);
      if (fromCache != null) {
        return Promise.resolve(fromCache);
      }
    }

    return getRelayObservable(
      params,
      variables
    ).toPromise() as Promise<GraphQLResponse>;
  }

  /*const network = Network.create(
    client.relayFetch(url),
    client.relayFetch(url)
  );*/
  const network = Network.create(fetchResponse, client.relayFetch(url));
  return network;
}

// by default relay is only scheduling cache garbage collection once a query is retained
// as our queries are long living and update more often, garbage collection should be scheduled more often.
// see https://github.com/facebook/relay/issues/3165
const attachGarbageCollectionBehavior = (store: Store): Store => {
  const notify = store.notify.bind(store);

  const scheduleGarbageCollection = throttle(
    store.scheduleGC.bind(store),
    5000
  );

  const newNotify: Store["notify"] = (...args) => {
    scheduleGarbageCollection();
    return notify(...args);
  };

  store.notify = newNotify;
  return store;
};

const createRelayEnvironment = (url: string | URL) => {
  const store = attachGarbageCollectionBehavior(new Store(new RecordSource()));

  return new Environment({
    network: createNetwork(url),
    store,
    isServer: isRuntimeServer()
  });
};

let environment: Environment;
export function getCurrentEnvironment(url: string | URL): Environment {
  if (isRuntimeServer() || !environment) {
    const _environment = createRelayEnvironment(url);

    if (!isRuntimeServer()) {
      environment = _environment;
    }

    return _environment;
  }

  return environment;
}
