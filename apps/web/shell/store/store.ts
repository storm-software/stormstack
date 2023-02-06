import { loggerMiddleware } from "@open-system/shared-ui-data-access";
import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist-indexeddb-storage";
import { rootReducer } from "./reducers";

const persistConfig = {
  key: "root",
  version: 1,
  storage: storage("ps-dev"),
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default function configureAppStore(preloadedState: any) {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(loggerMiddleware),
    preloadedState,
    enhancers: [],
  });

  if (process.env.NODE_ENV !== "production" && (module as any)?.hot) {
    (module as any)?.hot?.accept("./reducers", () =>
      store.replaceReducer(persistedReducer)
    );
  }

  return store;
}

export const store = configureAppStore({});
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
