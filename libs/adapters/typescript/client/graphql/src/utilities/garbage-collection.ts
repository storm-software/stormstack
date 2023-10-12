// by default relay is only scheduling cache garbage collection once a query is retained
// as our queries are long living and update more often, garbage collection should be scheduled more often.

import { throttle } from "@stormstack/core-shared-utilities";
import { Store } from "relay-runtime";

// see https://github.com/facebook/relay/issues/3165
export function attachGarbageCollectionBehavior(store: Store): Store {
  const notify = store.notify.bind(store);

  const scheduleGarbageCollection = throttle(
    store.scheduleGC.bind(store),
    5000 * 60
  );

  const newNotify: Store["notify"] = (...args) => {
    scheduleGarbageCollection();
    return notify(...args);
  };

  store.notify = newNotify;
  return store;
}
