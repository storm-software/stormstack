/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConsoleLogger } from "@open-system/core-typescript-utilities";
import {
  isRejectedWithValue,
  Middleware,
  MiddlewareAPI,
} from "@reduxjs/toolkit";
import { addErrorNotification } from "../state";

export const errorHandlerMiddleware: Middleware =
  (api: MiddlewareAPI) => next => action => {
    if (isRejectedWithValue(action)) {
      const message =
        action.error?.data?.message ??
        "An error occurred processing the request.";

      ConsoleLogger.error(message);
      api.dispatch(addErrorNotification(message));
    }

    return next(action);
  };
