import { MissingContextError } from "@stormstack/core-shared-utilities";
import { useContext } from "react";
import { ApiClient } from "../client/api-client";
import { ApiClientContext } from "../components/ApiClientProvider";

export const useApiClient = <
  TApiClient extends ApiClient = ApiClient
>(): ApiClient => {
  const context = useContext(ApiClientContext);
  if (!context) {
    throw new MissingContextError("ApiClientContext");
  }

  return context.client as TApiClient;
};
