/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  base64,
  unbase64
} from "@open-system/core-server-utilities/create-string-hash";
import { JsonParser } from "@open-system/core-shared-serialization/parser";
import type { ClientOptions, Client as ClientType, ServerOptions } from "memjs";
import { Client } from "memjs";
import { CacheClient } from "./cache-client";

export class MemCacheClient extends CacheClient {
  client?: ClientType | null;
  servers;
  options;

  constructor(servers: string, options?: ClientOptions & ServerOptions) {
    super();
    this.servers = servers;
    this.options = options;
  }

  async connect() {
    this.client = Client.create(this.servers, this.options);
  }

  /**
   * Gets a value from the cache
   * @param key - The key to get
   */
  override async disconnect() {
    this.client?.close();
    this.client = null;
  }

  /**
   * Gets a value from the cache
   * @param key - The key to get
   */
  async get(key: string) {
    if (!this.client) {
      await this.connect();
    }

    const result = await this.client?.get(key);

    if (result?.value) {
      return JSON.parse(result.value.toString());
    } else {
      return result?.value;
    }
  }

  /**
   * Sets a value in the cache. The return value will not be used.
   * @param key - The key to set
   * @param value - The value to set
   * @param options - Options for the cache
   */
  async set(
    key: string,
    value: unknown,
    options: { expires?: number } = { expires: 60 * 60 * 24 * 7 }
  ) {
    if (!this.client) {
      await this.connect();
    }

    return this.client?.set(key, JsonParser.stringify(value), options);
  }

  /**
   * Deletes a value from the cache
   * @param key - The key to delete
   */
  async del(key: string) {
    if (!this.client) {
      await this.connect();
    }

    // memcached returns true/false natively
    return this.client?.delete(key);
  }

  async delAll() {
    await this.client?.flush();
  }

  toCacheKey(value: unknown): string {
    return base64(JsonParser.stringify(value));
  }

  fromCacheKey(key: string): unknown {
    return JsonParser.parse(unbase64(key));
  }
}
