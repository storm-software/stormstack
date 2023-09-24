import { AsyncLocalStorage } from "node:async_hooks";
import { GlobalContext } from "./global-context";

let GlobalContextStore: AsyncLocalStorage<Map<string, GlobalContext>>;

/**
 * This returns a AsyncLocalStorage instance, not the actual store
 */
export const getGlobalContextStore = () => {
  if (!GlobalContextStore) {
    GlobalContextStore = new AsyncLocalStorage<Map<string, GlobalContext>>();
  }
  return GlobalContextStore as AsyncLocalStorage<Map<string, GlobalContext>>;
};
