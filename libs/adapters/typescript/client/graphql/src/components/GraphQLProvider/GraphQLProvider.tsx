import { BaseComponentProps } from "@stormstack/design-system-components";
import { RelayEnvironmentProvider } from "react-relay";
import { RecordMap } from "relay-runtime/lib/store/RelayStoreTypes";
import { useEnvironment } from "../../hooks";

export type RelayProviderProps = BaseComponentProps & {
  initialRecords?: RecordMap;
};

/**
 * A component that provides the environment for the application
 */
export const GraphQLProvider = ({
  children,
  initialRecords,
  ...props
}: RelayProviderProps) => {
  const environment = useEnvironment(initialRecords);

  return (
    <RelayEnvironmentProvider environment={environment}>
      {children}
    </RelayEnvironmentProvider>
  );
};
