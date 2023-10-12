import { BaseComponentProps } from "@stormstack/design-system-components";
import { RelayEnvironmentProvider } from "react-relay";
import { RecordMap } from "relay-runtime/lib/store/RelayStoreTypes";
import { useEnvironment } from "../../hooks";

export type EnvironmentProviderProps = BaseComponentProps & {
  initialRecords?: RecordMap;
};

/**
 * A component that provides the environment for the application
 */
export const EnvironmentProvider = ({
  children,
  initialRecords,
  ...props
}: EnvironmentProviderProps) => {
  const environment = useEnvironment(initialRecords);

  return (
    <RelayEnvironmentProvider environment={environment}>
      {children}
    </RelayEnvironmentProvider>
  );
};
