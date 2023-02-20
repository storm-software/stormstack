/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConsoleLogger } from "@open-system/core-typescript-utilities";
import { isRejected, Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
import { addErrorNotification } from "../state";

export const errorHandlerMiddleware: Middleware =
  (api: MiddlewareAPI) => next => action => {
    if (isRejected(action) && action?.error?.message) {
      const message = `An error occurred processing the request: ${action?.error?.message}`;

      ConsoleLogger.error(message);
      api.dispatch(addErrorNotification(message));
    }

    return next(action);
  };
