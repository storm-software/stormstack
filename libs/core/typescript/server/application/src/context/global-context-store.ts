import { AsyncLocalStorage } from "node:async_hooks";
import { GlobalServerContext } from "./global-context";

let GlobalContextStore: AsyncLocalStorage<Map<string, GlobalServerContext>>;

/**
 * This returns a AsyncLocalStorage instance, not the actual store
 */
export const getGlobalContextStore = () => {
  if (!GlobalContextStore) {
    GlobalContextStore = new AsyncLocalStorage<
      Map<string, GlobalServerContext>
    >();
  }
  return GlobalContextStore as AsyncLocalStorage<
    Map<string, GlobalServerContext>
  >;
};
