import { GraphQLSerializationMiddleware } from "@stormstack/adapters-client-graphql";
import {
  ApiClientProvider,
  ApiClientProviderProps
} from "@stormstack/core-client-api";
import { BaseComponentProps } from "@stormstack/design-system-components";
import { useMemo } from "react";
import {
  EnvironmentProvider,
  EnvironmentProviderProps
} from "../EnvironmentProvider";

export type GraphQLProviderProps = BaseComponentProps &
  EnvironmentProviderProps &
  ApiClientProviderProps;

/**
 * A component that provides the environment for the application
 */
export const GraphQLProvider = ({
  children,
  initialRecords,
  options,
  ...props
}: GraphQLProviderProps) => {
  const middleware = useMemo(() => {
    const result = [];
    if (options?.middleware) {
      result.push(...options.middleware);
    }

    result.push(GraphQLSerializationMiddleware);

    return result;
  }, [options?.middleware]);

  return (
    <ApiClientProvider options={{ ...options, middleware }}>
      <EnvironmentProvider initialRecords={initialRecords}>
        {children}
      </EnvironmentProvider>
    </ApiClientProvider>
  );
};
