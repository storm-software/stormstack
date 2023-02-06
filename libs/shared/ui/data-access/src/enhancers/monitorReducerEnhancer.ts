/* eslint-disable @typescript-eslint/ban-types */
import { ConsoleLogger } from "@open-system/core-typescript-utilities";
import { StoreEnhancerStoreCreator } from "@reduxjs/toolkit";

export const monitorReducerEnhancer: StoreEnhancerStoreCreator<any, any> =
  (createStore: any) => (reducer: any, initialState: any, enhancer: any) => {
    const monitoredReducer = (state: any, action: any) => {
      const start = performance.now();
      const newState = reducer(state, action);
      const end = performance.now();
      const diff = Math.round((end - start) * 100) / 100;

      ConsoleLogger.info(`reducer process time: ${diff}`);

      return newState;
    };

    return createStore(monitoredReducer, initialState, enhancer);
  };
