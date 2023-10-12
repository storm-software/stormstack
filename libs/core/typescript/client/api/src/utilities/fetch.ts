import {
  ApiClientResult,
  ApiClientResultStatus,
  CredentialOptions,
  RequestModes,
  createApiHeadersProxy,
  isStatusCodeSuccessful
} from "@stormstack/core-shared-api";
import { isRuntimeServer } from "@stormstack/core-shared-utilities";
import { ApiClientRequest, FetchOptions } from "../types";
import { deserializeResult, serializeRequest } from "./serialization";

export const handleFetch = async <TResponse extends Response = Response>(
  options: FetchOptions
): Promise<TResponse> => {
  const fetchImpl = options.customFetch || globalThis.fetch;

  let timeout: NodeJS.Timeout | undefined;
  if (!options.signal && options.timeoutMs) {
    const controller = new AbortController();
    timeout = setTimeout(() => controller.abort(), options.timeoutMs);
    options.signal = controller.signal;
  }

  // Only add credentials / mode if we are in a browser context,
  // otherwise it will throw on runtimes like Cloudflare Workers.
  const extraOptions: RequestInit = isRuntimeServer()
    ? { credentials: CredentialOptions.INCLUDE, mode: RequestModes.CORS }
    : {};

  try {
    return (await fetchImpl(options.url.toString(), {
      keepalive: true,
      ...extraOptions,
      ...options
    })) as TResponse;
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
  }
};

export const handleServerFetch = async <TResponse extends Response = Response>(
  options: ApiClientRequest
): Promise<ApiClientResult> => {
  const response = await handleFetch(serializeRequest(options));

  return deserializeResult({
    ...response,
    status: isStatusCodeSuccessful(response.status)
      ? ApiClientResultStatus.SUCCESS
      : ApiClientResultStatus.ERROR,
    data: await response.text(),
    headers: createApiHeadersProxy(response.headers)
  });
};
