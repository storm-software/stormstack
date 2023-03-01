import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { middleware } from "./middleware";
import { rootReducer } from "./reducers";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["user", "contact", "reaction"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default function configureAppStore(preloadedState: any) {
  const store = configureStore({
    reducer: persistedReducer,
    middleware,
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

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
