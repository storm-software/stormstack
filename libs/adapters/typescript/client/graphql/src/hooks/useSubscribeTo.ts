import { ApiClientResult, ApiErrorCode } from "@stormstack/core-shared-api";
import { StormError } from "@stormstack/core-shared-utilities";
import { useEffect, useRef, useState } from "react";
import { OperationType } from "relay-runtime";
import { GraphQLClient } from "../client";
import { useGraphQLClient } from "../hooks";
import {
  GraphQLSubscriptionRequestOptions,
  GraphQLSubscriptionToRequestOptions
} from "../types";

const subscribeTo = (
  client: GraphQLClient,
  options: GraphQLSubscriptionToRequestOptions
) => {
  const abort = new AbortController();
  const { onSuccess, onError, onResult, onAbort, ...subscription } = options;

  subscription.signal = abort.signal;
  client.subscribeTo({ ...subscription, onResult }).catch(onError);

  return () => {
    onAbort?.();
    abort.abort();
  };
};

export const useSubscribeTo = <TQuery extends OperationType>(
  props: GraphQLSubscriptionRequestOptions
): {
  isLoading: boolean;
  isSubscribed: boolean;
  data?: TQuery["response"];
  error?: ApiClientResult["error"];
} => {
  const client = useGraphQLClient();

  const {
    input,
    enabled,
    isLive,
    subscribeOnce,
    onSuccess,
    onError,
    operationKind,
    operationName
  } = props;
  const startedAtRef = useRef<number | null>(null);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  const [state, setState] = useState({
    isLoading: false,
    isSubscribed: false
  });

  const [data, setData] = useState<ApiClientResult["data"]>();
  const [error, setError] = useState<ApiClientResult["error"]>();

  useEffect(() => {
    if (enabled) {
      setState({ isLoading: true, isSubscribed: false });
    }
  }, [enabled]);

  useEffect(() => {
    let unsubscribe: ReturnType<typeof subscribeTo>;

    if (enabled) {
      unsubscribe = subscribeTo(client, {
        input,
        isLive,
        subscribeOnce,
        operationKind,
        operationName,
        onError(error: ApiClientResult["error"]) {
          setState({ isLoading: false, isSubscribed: false });
          onErrorRef.current?.(
            error ??
              new StormError(ApiErrorCode.connection_failure, "Unknown error")
          );
          startedAtRef.current = null;
        },
        onResult(result: ApiClientResult["data"]) {
          if (!startedAtRef.current) {
            setState({ isLoading: false, isSubscribed: true });
            onSuccessRef.current?.(result);
            startedAtRef.current = new Date().getTime();
          }

          setData(result.data);
          setError(result.error);
        },
        onAbort() {
          setState({ isLoading: false, isSubscribed: false });
          startedAtRef.current = null;
        }
      });
    }

    return () => {
      unsubscribe?.();
    };
  }, [enabled, isLive, subscribeOnce]);

  return {
    data,
    error,
    ...state
  };
};
