import { ApiClientResult } from "@stormstack/core-shared-api";
import { GraphQLResponse, Variables } from "relay-runtime";
import RelayQueryResponseCache from "relay-runtime/lib/network/RelayQueryResponseCache";

/**
 * A cache for storing query responses, featuring:
 * - `get` with TTL
 * - cache size limiting, with least-recently *updated* entries purged first
 */
export class ApiClientResultCache {
  protected _cache: RelayQueryResponseCache;

  constructor(size: number, ttl: number) {
    this._cache = new RelayQueryResponseCache({ size, ttl });
  }

  public clear = () => {
    this._cache.clear();
  };

  public get = (queryID: string, variables: Variables): ApiClientResult => {
    return this._cache.get(queryID, variables) as ApiClientResult;
  };

  public set = (
    queryID: string,
    variables: Variables,
    payload: ApiClientResult
  ) => {
    this._cache.set(queryID, variables, payload as GraphQLResponse);
  };
}
