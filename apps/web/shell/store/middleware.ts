import { contactApi } from "@open-system/contact-ui-data-access/apis";
import { reactionApi } from "@open-system/reaction-ui-data-access/apis";
import {
  errorHandlerMiddleware,
  loggerMiddleware,
  serializableMiddleware,
} from "@open-system/shared-ui-data-access";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

export const middleware = (getDefaultMiddleware: any) =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }).concat([
    loggerMiddleware,
    errorHandlerMiddleware,
    serializableMiddleware,
    reactionApi.middleware,
    contactApi.middleware,
  ]);
