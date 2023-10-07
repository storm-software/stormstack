import { CredentialOptions, RequestModes } from "@stormstack/core-shared-api";
import { isRuntimeServer } from "@stormstack/core-shared-utilities";
import { FetchOptions } from "../types";

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
