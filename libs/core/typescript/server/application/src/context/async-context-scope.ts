import { MissingContextError } from "@stormstack/core-shared-utilities";
import { AsyncLocalStorage } from "node:async_hooks";

const asyncLocalStorage = new AsyncLocalStorage<AsyncScope>();

export class AsyncScope {
  static get() {
    const scope = asyncLocalStorage.getStore();
    if (!scope) {
      throw new MissingContextError("GlobalContextStore");
    }

    return scope;
  }

  constructor(callback: () => void) {
    const parentScope = asyncLocalStorage.getStore();
    if (parentScope) {
      Object.setPrototypeOf(this, parentScope);
    }

    asyncLocalStorage.run(this, callback);
  }
}
