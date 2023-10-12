import { useApiClient } from "@stormstack/core-client-api";
import { useMemo } from "react";
import { RecordSource } from "relay-runtime";
import { RecordMap } from "relay-runtime/lib/store/RelayStoreTypes";
import { getEnvironment } from "../utilities/create-relay-environment";

export const useEnvironment = (initialRecords?: RecordMap) => {
  const client = useApiClient();
  const environment = useMemo(() => {
    const _environment = getEnvironment(client);

    if (initialRecords) {
      _environment.getStore().publish(new RecordSource(initialRecords));
    }

    return _environment;
  }, [initialRecords]);

  return environment;
};
