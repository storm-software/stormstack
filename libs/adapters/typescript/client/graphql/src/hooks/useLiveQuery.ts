import { SubscriptionRequestOptions } from "@stormstack/core-client-api";
import { useEffect } from "react";
import {
  PreloadedQuery,
  usePreloadedQuery,
  useRelayEnvironment
} from "react-relay";
import {
  GraphQLTaggedNode,
  OperationType,
  createOperationDescriptor,
  getRequest
} from "relay-runtime";
import { useSubscribeTo } from "./useSubscribeTo";

export const useLiveQuery = <TQuery extends OperationType>({
  query,
  queryReference,
  enabled = true,
  options = {}
}: {
  query: GraphQLTaggedNode;
  queryReference: PreloadedQuery<TQuery>;
  enabled?: boolean;
  options: Partial<SubscriptionRequestOptions>;
}) => {
  const data = usePreloadedQuery(query, queryReference);
  const { id, variables, kind, name } = queryReference;

  const request = getRequest(query);
  const operationDescriptor = createOperationDescriptor(request, variables);
  const environment = useRelayEnvironment();

  const { data: liveData, ...subscriptionResponse } = useSubscribeTo<TQuery>({
    ...options,
    operationName: id ? id : name,
    operationKind: kind,
    input: {
      ...variables,
      ...options.input
    },
    enabled: enabled ?? false,
    isLive: enabled ?? false
  });

  useEffect(() => {
    if (liveData) {
      environment.commitPayload(operationDescriptor, liveData);
    }
  }, [liveData]);

  return {
    ...subscriptionResponse,
    data: data
  };
};
