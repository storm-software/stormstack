/* eslint-disable @typescript-eslint/no-empty-function */
import React, { Context } from "react";
import { ApiClient } from "../client";

export type ApiClientContextState = {
  client: ApiClient | null;
};

// Initial context values
export const initialContext: ApiClientContextState = {
  client: null
};

// Create the context
export const ApiClientContext: Context<ApiClientContextState> =
  React.createContext(initialContext);

// Export the Provider and Consumer
export const ApiClientProvider = ApiClientContext.Provider;

export const ApiClientConsumer = ApiClientContext.Consumer;
