/* eslint-disable @typescript-eslint/no-explicit-any */

import { DateTime } from "../common";
import { ConsoleLogger } from "../logging";
import { HttpFetchApi } from "../types";
import { RequestContext } from "./request-context";
import { ResponseContext } from "./response-context";

export type HttpHandlerReturn<T = any, E = any, M = any> =
  | {
      error: E;
      data: ResponseContext<T>;
      meta?: M | undefined;
    }
  | {
      error?: undefined;
      data: ResponseContext<T>;
      meta?: M | undefined;
    };

export type HttpHandler = (
  request: RequestContext,
  api?: HttpFetchApi,
  extraOptions?: any
) => Promise<HttpHandlerReturn<any, Error | undefined, any>>;

export const fetchHttpHandler =
  ({ baseUrl }: { baseUrl: string }) =>
  async (
    request: RequestContext,
    api?: HttpFetchApi,
    extraOptions?: any
  ): Promise<HttpHandlerReturn> => {
    const timestamp = DateTime.current;

    const url = request.getUrl(baseUrl, api, extraOptions);

    ConsoleLogger.debug(`Sending request to ${url}`);

    const response = await fetch(url, request.getRequestOptions());

    ConsoleLogger.debug(
      `Received response status code: ${response.status} (${url})`
    );

    const headers: { [name: string]: string } = {};
    response.headers.forEach((value: string, name: string) => {
      headers[name] = value;
    });

    return {
      data: ResponseContext.create(
        response.status,
        headers,
        {
          text: () => response.text(),
          binary: () => response.blob(),
        },
        response.statusText
      ),
      meta: {
        type: response.type,
        timestamp,
        extraOptions,
      },
    };
  };
