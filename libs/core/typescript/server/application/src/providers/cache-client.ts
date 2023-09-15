/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseUtilityClass } from "@open-system/core-shared-utilities/common/base-utility-class";
import { CACHE_TOKEN } from "../types";

export abstract class CacheClient extends BaseUtilityClass {
  constructor() {
    super(CACHE_TOKEN);
  }

  /**
   * Disconnect from the cache
   *
   * If your client won't automatically reconnect, implement this function
   * to do it manually
   */
  disconnect?(): void | Promise<void>;

  abstract connect(): void | Promise<void>;

  /**
   * Gets a value from the cache
   * @param key - The key to get
   */
  abstract get(key: string): any;

  /**
   * Sets a value in the cache. The return value will not be used.
   * @param key - The key to set
   * @param value - The value to set
   * @param options - Options for the cache
   */
  abstract set(
    key: string,
    value: unknown,
    options: { expires?: number }
  ): Promise<any> | any; // types are tightened in the child classes

  /**
   * Deletes a value from the cache
   * @param key - The key to delete
   */
  abstract del(key: string): Promise<boolean> | any;
}
