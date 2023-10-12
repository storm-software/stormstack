import { useContext } from "react";
import { ApiClient } from "../client/api-client";
import { ApiClientContext } from "../contexts/api-client.context";

export const useApiClient = <
  TApiClient extends ApiClient = ApiClient
>(): ApiClient | null => {
  const { client } = useContext(ApiClientContext);

  return client as TApiClient;
};
