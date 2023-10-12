/* eslint-disable @typescript-eslint/no-empty-function */
import { ClientPublicEnvManager } from "@stormstack/core-client-env";
import { BaseComponentProps } from "@stormstack/design-system-components";
import React, { Context, useMemo } from "react";
import { ApiClient, ApiClientOptions } from "../../client";

export type ApiClientProviderProps<
  TOptions extends ApiClientOptions = ApiClientOptions
> = BaseComponentProps & {
  options?: TOptions;
};

export type ApiClientContextState = {
  client: ApiClient;
};

const initialContextState: ApiClientContextState = {
  client: new ApiClient(new ClientPublicEnvManager(), {})
};

// Create the context
export const ApiClientContext: Context<ApiClientContextState> =
  React.createContext<ApiClientContextState>(initialContextState);

/**
 * A component that provides the environment for the application
 */
export const ApiClientProvider = <
  TOptions extends ApiClientOptions = ApiClientOptions
>({
  children,
  options,
  ...props
}: ApiClientProviderProps<TOptions>) => {
  const client = useMemo(
    () => new ApiClient(new ClientPublicEnvManager(), options),
    [options]
  );

  return (
    <ApiClientContext.Provider value={{ client }}>
      {children}
    </ApiClientContext.Provider>
  );
};
