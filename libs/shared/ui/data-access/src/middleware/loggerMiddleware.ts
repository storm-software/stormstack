/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConsoleLogger } from "@open-system/core-typescript-utilities";

export const loggerMiddleware =
  (store: any) => (next: (action: any) => any) => (action: any) => {
    ConsoleLogger.group(action.type);

    ConsoleLogger.info("dispatching");
    ConsoleLogger.info(action as any);

    const result = next(action);

    ConsoleLogger.info("next state");
    ConsoleLogger.info(store.getState());

    ConsoleLogger.groupEnd();

    return result;
  };
